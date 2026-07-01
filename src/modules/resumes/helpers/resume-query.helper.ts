import { NotFoundException } from "@nestjs/common";
import { Model } from "mongoose";
import { ResumeDocument } from "../schemas";

export async function findResume(
    model: Model<ResumeDocument>,
    id: string,
    userId?: string,
) {
    const filter: { _id: string; userId?: string } = { _id: id };
    if (userId) filter.userId = userId;

    const resume = await model.findOne(filter);

    if (!resume) {
        throw new NotFoundException("Resume not found");
    }

    return resume;
}
