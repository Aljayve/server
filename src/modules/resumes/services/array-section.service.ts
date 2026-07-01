import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";

import { Resume, ResumeDocument } from "../schemas";
import { findResume } from "../helpers/resume-query.helper";

type ArraySectionField =
    | "experiences"
    | "education"
    | "projects"
    | "certifications"
    | "languages"
    | "awards"
    | "references"
    | "customSections";

@Injectable()
export class ArraySectionService {
    constructor(
        @InjectModel(Resume.name)
        private readonly resumeModel: Model<ResumeDocument>,
    ) { }

    async addItem<T>(
        resumeId: string,
        userId: string,
        field: ArraySectionField,
        dto: T,
    ) {
        const resume = await findResume(this.resumeModel, resumeId, userId);

        const item = {
            id: new Types.ObjectId().toString(),
            ...dto,
        };

        (resume.content[field] as any[]).push(item);
        await resume.save();

        return resume;
    }

    async updateItem<T>(
        resumeId: string,
        userId: string,
        field: ArraySectionField,
        itemId: string,
        dto: T,
    ) {
        const resume = await findResume(this.resumeModel, resumeId, userId);

        const items = resume.content[field] as any[];
        const item = items.find(i => i.id === itemId);

        if (!item) {
            throw new NotFoundException(`${field} item not found`);
        }

        Object.assign(item, dto);
        await resume.save();

        return resume;
    }

    async removeItem(
        resumeId: string,
        userId: string,
        field: ArraySectionField,
        itemId: string,
    ) {
        const resume = await findResume(this.resumeModel, resumeId, userId);

        const items = resume.content[field] as any[];
        const originalLength = items.length;

        (resume.content[field] as any[]) = items.filter(
            i => i.id !== itemId,
        );

        if ((resume.content[field] as any[]).length === originalLength) {
            throw new NotFoundException(`${field} item not found`);
        }

        await resume.save();

        return resume;
    }
}
