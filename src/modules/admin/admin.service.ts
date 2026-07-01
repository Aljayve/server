import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "../users/schemas/user.schema";
import { Resume, ResumeDocument } from "../resumes/schemas/resume.schema";
import { CoverLetter } from "../cover-letters/schemas/cover-letter.schema";
import { Template, TemplateDocument } from "../templates/schemas/template.schema";
import { AppSettings, AppSettingsDocument } from "./schemas/app-settings.schema";

@Injectable()
export class AdminService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        @InjectModel(Resume.name) private readonly resumeModel: Model<ResumeDocument>,
        @InjectModel(CoverLetter.name) private readonly coverLetterModel: Model<any>,
        @InjectModel(Template.name) private readonly templateModel: Model<TemplateDocument>,
        @InjectModel(AppSettings.name) private readonly appSettingsModel: Model<AppSettingsDocument>,
    ) { }

    async getUsers() {
        const users = await this.userModel.find().sort({ createdAt: -1 }).lean() as any[];

        const userIds = users.map((u) => u._id);

        const [resumeCounts, coverLetterCounts] = await Promise.all([
            this.resumeModel.aggregate([
                { $match: { userId: { $in: userIds } } },
                { $group: { _id: "$userId", count: { $sum: 1 } } },
            ]).exec(),
            this.coverLetterModel.aggregate([
                { $match: { userId: { $in: userIds } } },
                { $group: { _id: "$userId", count: { $sum: 1 } } },
            ]).exec(),
        ]);

        const resumeMap = Object.fromEntries(resumeCounts.map((r: any) => [r._id.toString(), r.count]));
        const coverMap = Object.fromEntries(coverLetterCounts.map((c: any) => [c._id.toString(), c.count]));

        return users.map((u: any) => ({
            id: u._id.toString(),
            name: `${u.firstName} ${u.lastName}`,
            email: u.email,
            role: u.role || "user",
            status: u.status || "active",
            avatar: u.avatar?.url || "",
            resumes: resumeMap[u._id.toString()] || 0,
            exports: coverMap[u._id.toString()] || 0,
            createdAt: u.createdAt?.toISOString?.() || u.createdAt,
        }));
    }

    async getAnalytics() {
        const now = new Date();
        const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const firstOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const [
            totalUsers,
            totalResumes,
            totalCoverLetters,
            atsAnalyzed,
            usersThisMonth,
            usersLastMonth,
            resumesThisMonth,
            resumesLastMonth,
            coverThisMonth,
            coverLastMonth,
            atsThisMonth,
            atsLastMonth,
            userGrowthData,
            resumeCreationData,
            templateData,
        ] = await Promise.all([
            this.userModel.countDocuments().exec(),
            this.resumeModel.countDocuments().exec(),
            this.coverLetterModel.countDocuments().exec(),
            this.resumeModel.countDocuments({ atsScore: { $gt: 0 } }).exec(),
            this.userModel.countDocuments({ createdAt: { $gte: firstOfMonth } }).exec(),
            this.userModel.countDocuments({ createdAt: { $gte: firstOfLastMonth, $lt: firstOfMonth } }).exec(),
            this.resumeModel.countDocuments({ createdAt: { $gte: firstOfMonth } }).exec(),
            this.resumeModel.countDocuments({ createdAt: { $gte: firstOfLastMonth, $lt: firstOfMonth } }).exec(),
            this.coverLetterModel.countDocuments({ createdAt: { $gte: firstOfMonth } }).exec(),
            this.coverLetterModel.countDocuments({ createdAt: { $gte: firstOfLastMonth, $lt: firstOfMonth } }).exec(),
            this.resumeModel.countDocuments({ atsScore: { $gt: 0 }, createdAt: { $gte: firstOfMonth } }).exec(),
            this.resumeModel.countDocuments({ atsScore: { $gt: 0 }, createdAt: { $gte: firstOfLastMonth, $lt: firstOfMonth } }).exec(),
            this.userModel.aggregate([
                { $match: { createdAt: { $gte: new Date(now.getFullYear() - 1, 0, 1) } } },
                { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, count: { $sum: 1 } } },
                { $sort: { "_id.year": 1, "_id.month": 1 } },
            ]).exec(),
            this.resumeModel.aggregate([
                { $match: { createdAt: { $gte: new Date(now.getFullYear() - 1, 0, 1) } } },
                { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, count: { $sum: 1 } } },
                { $sort: { "_id.year": 1, "_id.month": 1 } },
            ]).exec(),
            this.resumeModel.aggregate([
                { $group: { _id: "$template", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
            ]).exec(),
        ]);

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        const userGrowthChart = userGrowthData.map((d: any) => ({
            month: `${monthNames[d._id.month - 1]} ${d._id.year}`,
            users: d.count,
        }));

        const resumeCreationChart = resumeCreationData.map((d: any) => ({
            month: `${monthNames[d._id.month - 1]} ${d._id.year}`,
            resumes: d.count,
        }));

        const templateUsageChart = templateData.map((d: any) => ({
            name: d._id || "Unknown",
            usage: d.count,
        }));

        const topTemplates = templateData.map((d: any, i: number) => ({
            rank: i + 1,
            name: d._id || "Unknown",
            usage: d.count,
            trend: 0,
        }));

        const calcTrend = (current: number, previous: number) => {
            if (previous === 0) return current > 0 ? 100 : 0;
            return Math.round(((current - previous) / previous) * 100);
        };

        return {
            stats: {
                totalUsers,
                totalResumes,
                totalExports: totalCoverLetters,
                totalJobMatches: atsAnalyzed,
                visitorTrend: calcTrend(usersThisMonth, usersLastMonth),
                resumeTrend: calcTrend(resumesThisMonth, resumesLastMonth),
                exportTrend: calcTrend(coverThisMonth, coverLastMonth),
                atsTrend: calcTrend(atsThisMonth, atsLastMonth),
            },
            userGrowth: userGrowthChart,
            resumeCreation: resumeCreationChart,
            templateUsage: templateUsageChart,
            topTemplates,
        };
    }

    async getAppSettings() {
        let settings = await this.appSettingsModel.findOne().exec();
        if (!settings) {
            settings = await this.appSettingsModel.create({});
        }
        return settings;
    }

    async updateAppSettings(dto: Partial<AppSettings>) {
        let settings = await this.appSettingsModel.findOne().exec();
        if (!settings) {
            settings = await this.appSettingsModel.create(dto);
        } else {
            await this.appSettingsModel.updateOne({}, { $set: dto }).exec();
            settings = await this.appSettingsModel.findOne().exec();
        }
        return settings;
    }

    async getTemplates() {
        const [templates, usage] = await Promise.all([
            this.templateModel.find().sort({ title: 1 }).lean() as any,
            this.resumeModel.aggregate([
                { $group: { _id: "$template", count: { $sum: 1 } } },
            ]).exec(),
        ]);
        const usageMap = Object.fromEntries(usage.map((u: any) => [u._id, u.count]));

        return templates.map((t: any) => ({
            id: t._id.toString(),
            name: t.title,
            slug: t.slug,
            category: t.category || "General",
            status: t.enabled ? "active" : "inactive",
            atsFriendly: t.slug?.includes("ats") || t.category?.toLowerCase() === "ats",
            featured: t.premium || false,
            usageCount: usageMap[t.slug] || 0,
        }));
    }

    async getResumes() {
        const resumes = await this.resumeModel.find()
            .populate("userId", "firstName lastName email")
            .sort({ createdAt: -1 })
            .lean() as any[];

        return resumes.map((r: any) => ({
            id: r._id.toString(),
            title: r.title,
            owner: r.userId ? `${r.userId.firstName} ${r.userId.lastName}` : "Unknown",
            template: r.template || "ats-classic",
            atsScore: r.atsScore || 0,
            status: r.isArchived ? "draft" : "published",
            createdAt: r.createdAt?.toISOString?.() || r.createdAt,
        }));
    }

    async getDashboard() {
        const [totalUsers, totalResumes, totalCoverLetters, analyzedResumes, recentUsers, recentResumes] =
            await Promise.all([
                this.userModel.countDocuments().exec(),
                this.resumeModel.countDocuments().exec(),
                this.coverLetterModel.countDocuments().exec(),
                this.resumeModel.countDocuments({ atsScore: { $gt: 0 } }).exec(),
                this.userModel.find().sort({ createdAt: -1 as any }).limit(5).lean() as any,
                this.resumeModel.find().populate("userId", "firstName lastName email").sort({ createdAt: -1 as any }).limit(10).lean() as any,
            ]);

        const activities = recentResumes.map((r: any) => ({
            id: r._id.toString(),
            action: "New Resume Created",
            user: r.userId ? `${r.userId.firstName} ${r.userId.lastName}` : "Unknown",
            date: this.timeAgo(r.createdAt),
        }));

        const latestUsers = recentUsers.map((u: any) => ({
            id: (u._id as any).toString(),
            name: `${u.firstName} ${u.lastName}`,
            email: u.email,
            avatar: u.avatar?.url || "",
            joined: this.timeAgo(u.createdAt),
        }));

        return {
            stats: {
                totalUsers,
                totalResumes,
                totalExports: totalCoverLetters,
                totalJobMatches: analyzedResumes,
            },
            recentActivities: activities.slice(0, 6),
            latestUsers,
        };
    }

    private timeAgo(date: Date): string {
        const diff = Date.now() - new Date(date).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return "Just now";
        if (mins < 60) return `${mins} min ago`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        if (days === 1) return "1 day ago";
        if (days < 7) return `${days} days ago`;
        return `${Math.floor(days / 7)}w ago`;
    }
}
