import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx";
import { CoverLetter } from "./schemas/cover-letter.schema";
import { ResumesService } from "../resumes/resumes.service";
import { CoverLetterPdfRenderer } from "./renderers/cover-letter-pdf.renderer";
import { generatePdf } from "../pdf/helpers/generate-pdf";
import { AiService } from "../ai/ai.service";
import { UsersService } from "../users/users.service";

@Injectable()
export class CoverLetterService {
    constructor(
        @InjectModel(CoverLetter.name) private readonly model: Model<CoverLetter>,
        private readonly resumesService: ResumesService,
        private readonly aiService: AiService,
        private readonly usersService: UsersService,
    ) {}

    async generate(userId: string, dto: {
        resumeId: string;
        jobTitle: string;
        companyName: string;
        jobDescription?: string;
    }) {
        const resume = await this.resumesService.findOne(dto.resumeId, userId);
        if (!resume) throw new NotFoundException("Resume not found");

        const info = resume.content?.personalInfo ?? {};
        const name = [info.firstName, info.lastName].filter(Boolean).join(" ") || "Applicant";
        const email = info.email || "";
        const phone = info.phone || "";
        const city = info.city || "";
        const country = info.country || "";
        const linkedin = info.linkedin || "";
        const portfolio = info.portfolio || "";
        const github = info.github || "";

        const label = info.label || "";
        const rawSkills = resume.content?.skills ?? [];
        const skills = rawSkills.length > 0 ? rawSkills : [];

        const experiences = resume.content?.experiences ?? [];
        const education = resume.content?.education ?? [];
        const projects = resume.content?.projects ?? [];

        const totalYears = this.calcTotalYears(experiences);

        const since = await this.usersService.getResetDate(userId);
        const currentCount = await this.model.countDocuments({ userId, createdAt: { $gte: since } });
        await this.usersService.checkPlanLimit(userId, "coverLetters", currentCount);

        const now = new Date().toLocaleDateString("en-US", {
            month: "long", day: "numeric", year: "numeric",
        });

        let content: string;

        if (await this.aiService.isAvailable()) {
            try {
                content = await this.generateWithAi(name, email, phone, city, country, linkedin, portfolio, github, label, skills, experiences, education, projects, totalYears, dto);
            } catch {
                content = this.generateTemplate(name, label, skills, totalYears, dto, now);
            }
        } else {
            content = this.generateTemplate(name, label, skills, totalYears, dto, now);
        }

        const doc = await this.model.create({
            userId,
            resumeId: dto.resumeId,
            jobTitle: dto.jobTitle,
            companyName: dto.companyName,
            jobDescription: dto.jobDescription ?? "",
            content,
        });

        return doc.toObject();
    }

    async findAll(userId: string) {
        return this.model.find({ userId }).sort({ createdAt: -1 }).lean();
    }

    private calcTotalYears(experiences: any[]): number {
        const years = new Set<number>();
        for (const exp of experiences) {
            const start = exp.startDate ? new Date(exp.startDate).getFullYear() : null;
            const end = exp.endDate ? new Date(exp.endDate).getFullYear() : new Date().getFullYear();
            if (start && end) {
                for (let y = start; y <= end; y++) years.add(y);
            }
        }
        return years.size;
    }

    private generateTemplate(
        name: string,
        label: string,
        skills: string[],
        totalYears: number,
        dto: { jobTitle: string; companyName: string; jobDescription?: string },
        date: string,
    ): string {
        const skillList = skills.length > 0 ? skills.join(", ") : "relevant professional skills";
        const yearPhrase = totalYears > 0 ? `With over ${totalYears} years of experience` : `With my background`;

        return [
            date,
            "",
            `Dear Hiring Manager,`,
            "",
            `I am writing to express my enthusiastic interest in the ${dto.jobTitle} position at ${dto.companyName}. ` +
            `${yearPhrase} in ${label || skillList}, I am confident that my experience and skills align perfectly with the requirements of this role.`,
            "",
            `Throughout my career, I have developed strong expertise in ${skillList}. ` +
            `My ability to ${label ? label.toLowerCase() : "deliver high-quality results"} has allowed me to make meaningful contributions to every team I've been a part of. ` +
            `I am excited about the opportunity to bring this experience to ${dto.companyName} and help drive continued success.`,
            "",
            dto.jobDescription
                ? `After reviewing the job description, I am particularly drawn to the opportunity to contribute to your team's goals. ` +
                  `I believe my skills in ${skillList} would enable me to hit the ground running and deliver value from day one.`
                : `I am eager to bring my skills and enthusiasm to ${dto.companyName} and would welcome the opportunity to discuss how my experience matches your needs.`,
            "",
            `Thank you for considering my application. I look forward to the possibility of discussing how I can contribute to the success of ${dto.companyName}.`,
            "",
            "Sincerely,",
            name,
        ].join("\n");
    }

    private async generateWithAi(
        name: string,
        email: string,
        phone: string,
        city: string,
        country: string,
        linkedin: string,
        portfolio: string,
        github: string,
        label: string,
        skills: string[],
        experiences: any[],
        education: any[],
        projects: any[],
        totalYears: number,
        dto: { jobTitle: string; companyName: string; jobDescription?: string },
    ): Promise<string> {
        const contact = [
            email && `Email: ${email}`,
            phone && `Phone: ${phone}`,
            [city, country].filter(Boolean).join(", ") && `Location: ${[city, country].filter(Boolean).join(", ")}`,
            linkedin && `LinkedIn: ${linkedin}`,
            portfolio && `Portfolio: ${portfolio}`,
            github && `GitHub: ${github}`,
        ].filter(Boolean).join("\n");

        const expSummary = experiences.slice(0, 3).map((e: any) =>
            `- ${e.title || e.position} at ${e.company}${e.startDate ? ` (${e.startDate} - ${e.endDate || "Present"})` : ""}`
        ).join("\n");

        const eduSummary = education.slice(0, 2).map((e: any) =>
            `- ${e.degree || ""}${e.field ? ` in ${e.field}` : ""}${e.institution ? `, ${e.institution}` : ""}`
        ).join("\n");

        const projSummary = projects.slice(0, 3).map((p: any) =>
            `- ${p.name}${p.description ? `: ${p.description.slice(0, 120)}` : ""}`
        ).join("\n");

        const prompt = `Write a professional cover letter for:
Name: ${name}
Current Role: ${label || "Professional"}
${contact ? `${contact}\n` : ""}Skills: ${skills.join(", ")}
${totalYears > 0 ? `Total Experience: ${totalYears} years\n` : ""}${expSummary ? `\nExperience:\n${expSummary}` : ""}
${eduSummary ? `\nEducation:\n${eduSummary}` : ""}
${projSummary ? `\nProjects:\n${projSummary}` : ""}
Job Title: ${dto.jobTitle}
Company: ${dto.companyName}
${dto.jobDescription ? `\nJob Description:\n${dto.jobDescription}` : ""}

Write a compelling, personalized cover letter using the applicant's real contact information and experience. Do NOT include placeholder text like [Address], [City], [Email], [Phone], [X], [Number] or any bracketed fields. Use the actual data provided above. The letter should be ready to send with no edits needed.`;

        return this.aiService.generateText(prompt, {
            systemPrompt: "You are a professional career coach and cover letter writer. Write concise, impactful cover letters using only the real data provided. Never use placeholder brackets or vague placeholders like [X].",
            maxTokens: 1024,
            temperature: 0.7,
        });
    }

    async findOne(id: string, userId: string) {
        const doc = await this.model.findOne({ _id: id, userId }).lean();
        if (!doc) throw new NotFoundException("Cover letter not found");
        return doc;
    }

    async remove(id: string, userId: string) {
        const doc = await this.model.findOneAndDelete({ _id: id, userId }).lean();
        if (!doc) throw new NotFoundException("Cover letter not found");
        return doc;
    }

    async exportPdf(id: string, userId: string): Promise<Buffer> {
        const doc = await this.model.findOne({ _id: id, userId }).lean();
        if (!doc) throw new NotFoundException("Cover letter not found");

        const renderer = new CoverLetterPdfRenderer();
        const html = renderer.render({
            content: doc.content,
            jobTitle: doc.jobTitle,
            companyName: doc.companyName,
        });

        return generatePdf(html);
    }

    async exportDocx(id: string, userId: string): Promise<Buffer> {
        const doc = await this.model.findOne({ _id: id, userId }).lean();
        if (!doc) throw new NotFoundException("Cover letter not found");

        const lines = doc.content.split("\n");

        const docx = new Document({
            sections: [{
                properties: {
                    page: {
                        size: { width: 11906, height: 16838 },
                        margin: { top: 1440, bottom: 1440, left: 1700, right: 1700 },
                    },
                },
                children: lines.map(line => {
                    const trimmed = line.trim();
                    if (trimmed.length === 0) {
                        return new Paragraph({ spacing: { after: 200 } });
                    }
                    return new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 120, line: 360 },
                        children: [
                            new TextRun({
                                text: trimmed,
                                size: 24,
                                font: "Times New Roman",
                            }),
                        ],
                    });
                }),
            }],
        });

        return Buffer.from(await Packer.toBuffer(docx));
    }
}
