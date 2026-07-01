import { Injectable, ForbiddenException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Resume, ResumeDocument } from "../schemas";
import { Template, TemplateDocument } from "../../templates/schemas/template.schema";
import { CreateResumeDto } from "../dto/create-resume.dto";
import { UpdateResumeDto } from "../dto/update-resume.dto";
import { UpdateSkillsDto } from "../dto/sections/update-skills.dto";
import { findResume } from "../helpers/resume-query.helper";
import { UsersService } from "../../users/users.service";

@Injectable()
export class ResumeCrudService {
    constructor(
        @InjectModel(Resume.name)
        private readonly resumeModel: Model<ResumeDocument>,
        @InjectModel(Template.name)
        private readonly templateModel: Model<TemplateDocument>,
        private readonly usersService: UsersService,
    ) { }

    async create(userId: string, dto: CreateResumeDto) {
        const since = await this.usersService.getResetDate(userId);
        const currentCount = await this.resumeModel.countDocuments({ userId, isArchived: false, createdAt: { $gte: since } });
        await this.usersService.checkPlanLimit(userId, "resumes", currentCount);

        if (dto.template) {
            const user = await this.usersService.findById(userId);
            const template = await this.templateModel.findOne({ slug: dto.template }).exec();
            if (template?.premium && user.plan === "free") {
                throw new ForbiddenException("Premium templates require a Pro or Enterprise plan");
            }
        }

        return this.resumeModel.create({ ...dto, userId });
    }

    async findAll(userId: string) {
        return this.resumeModel
            .find({ userId, isArchived: false })
            .sort({ updatedAt: -1 });
    }

    async findOne(id: string, userId: string) {
        return findResume(this.resumeModel, id, userId);
    }

    async findById(id: string) {
        return findResume(this.resumeModel, id);
    }

    async update(id: string, userId: string, dto: UpdateResumeDto) {
        const resume = await this.resumeModel.findOneAndUpdate(
            { _id: id, userId },
            dto,
            { returnDocument: "after" },
        );

        if (!resume) {
            throw new NotFoundException("Resume not found");
        }

        return resume;
    }

    async updatePhoto(id: string, userId: string, photoUrl: string) {
        const resume = await this.resumeModel.findOneAndUpdate(
            { _id: id, userId },
            { $set: { "content.personalInfo.photo": photoUrl } },
            { returnDocument: "after" },
        );

        if (!resume) {
            throw new NotFoundException("Resume not found");
        }

        return resume;
    }

    async updateSkills(id: string, userId: string, dto: UpdateSkillsDto) {
        const resume = await this.resumeModel.findOneAndUpdate(
            { _id: id, userId },
            { $set: { "content.skills": dto.skills ?? [] } },
            { returnDocument: "after" },
        );

        if (!resume) {
            throw new NotFoundException("Resume not found");
        }

        return resume;
    }

    async updateAtsScore(id: string, score: number) {
        return this.resumeModel.findByIdAndUpdate(
            id,
            { $set: { atsScore: score } },
            { returnDocument: "after" },
        );
    }

    async remove(id: string, userId: string) {
        const resume = await this.resumeModel.findOneAndUpdate(
            { _id: id, userId },
            { isArchived: true },
            { returnDocument: "after" },
        );

        if (!resume) {
            throw new NotFoundException("Resume not found");
        }

        return { message: "Resume archived successfully" };
    }
}
