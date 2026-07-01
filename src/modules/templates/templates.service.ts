import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Template, TemplateDocument } from "./schemas/template.schema";
import { Model } from "mongoose";

@Injectable()
export class TemplatesService {
    constructor(
        @InjectModel(Template.name)
        private readonly templateModel: Model<TemplateDocument>,
    ) { }

    async findAll(plan?: string) {
        const filter: any = { enabled: true };

        if (!plan || plan === "free") {
            filter.premium = false;
        }

        return this.templateModel
            .find(filter)
            .sort({
                premium: -1,
                title: 1,
            });
    }

    async findBySlug(slug: string) {
        const template =
            await this.templateModel.findOne({
                slug,
                enabled: true,
            });

        if (!template) {
            throw new NotFoundException(
                "Template not found",
            );
        }

        return template;
    }
}