import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Resume, ResumeDocument } from "../schemas";
import { UpdatePersonalInfoDto } from "../dto/sections/update-personal-info.dto";

@Injectable()
export class PersonalInfoService {
    constructor(
        @InjectModel(Resume.name)
        private readonly resumeModel: Model<ResumeDocument>,
    ) { }

    async update(id: string, userId: string, dto: UpdatePersonalInfoDto) {
        const updateData: Record<string, any> = {};

        for (const [key, val] of Object.entries(dto)) {
            if (val !== undefined && val !== null) {
                updateData[`content.personalInfo.${key}`] = val;
            }
        }

        const resume = await this.resumeModel.findOneAndUpdate(
            { _id: id, userId },
            { $set: updateData },
            { returnDocument: "after" },
        );

        if (!resume) {
            throw new NotFoundException("Resume not found");
        }

        return resume;
    }
}
