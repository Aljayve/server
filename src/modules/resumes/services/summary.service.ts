import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Resume, ResumeDocument } from "../schemas";
import { UpdateSummaryDto } from "../dto/sections/update-summary.dto";

@Injectable()
export class SummaryService {
    constructor(
        @InjectModel(Resume.name)
        private readonly resumeModel: Model<ResumeDocument>,
    ) { }

    async update(id: string, userId: string, dto: UpdateSummaryDto) {
        const resume = await this.resumeModel.findOneAndUpdate(
            { _id: id, userId },
            { $set: { "content.summary": dto.summary } },
            { returnDocument: "after" },
        );

        if (!resume) {
            throw new NotFoundException("Resume not found");
        }

        return resume;
    }
}
