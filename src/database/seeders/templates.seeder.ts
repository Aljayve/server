import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import {
    Template,
    TemplateDocument,
} from "../../modules/templates/schemas/template.schema";

export const templates = [
    {
        title: "ATS Classic",
        slug: "ats-classic",
        category: "ATS Friendly",
        description: "Clean, parseable layout optimized for ATS systems.",
        thumbnail: "",
        premium: false,
        enabled: true,
    },
    {
        title: "Modern",
        slug: "modern",
        category: "Modern",
        description: "Sleek and minimal design for modern professionals.",
        thumbnail: "",
        premium: false,
        enabled: true,
    },
    {
        title: "Professional",
        slug: "professional",
        category: "Corporate",
        description: "Traditional two-column design suited for corporate roles.",
        thumbnail: "",
        premium: false,
        enabled: true,
    },
    {
        title: "Accessible",
        slug: "accessible",
        category: "ATS Friendly",
        description: "Screen-reader-friendly layout with clean typography.",
        thumbnail: "",
        premium: false,
        enabled: true,
    },
    {
        title: "Creative",
        slug: "creative",
        category: "Design",
        description: "Visual layout for design and creative roles.",
        thumbnail: "",
        premium: true,
        enabled: true,
    },
    {
        title: "Technical",
        slug: "technical",
        category: "Tech",
        description: "Technical layout highlighting skills, projects, and code.",
        thumbnail: "",
        premium: false,
        enabled: true,
    },
    {
        title: "Header Band",
        slug: "header-band",
        category: "Modern",
        description: "Bold header band design with color accent sections.",
        thumbnail: "",
        premium: false,
        enabled: true,
    },
    {
        title: "Inspired",
        slug: "inspired",
        category: "Modern",
        description: "Modern layout with icon-driven section headers.",
        thumbnail: "",
        premium: false,
        enabled: true,
    },
    {
        title: "Plain",
        slug: "plain",
        category: "ATS Friendly",
        description: "Straightforward no-frills layout for maximum ATS compatibility.",
        thumbnail: "",
        premium: false,
        enabled: true,
    },
    {
        title: "Versatile",
        slug: "versatile",
        category: "Corporate",
        description: "Flexible layout that works across industries and roles.",
        thumbnail: "",
        premium: false,
        enabled: true,
    },
    {
        title: "Straightforward",
        slug: "straightforward",
        category: "ATS Friendly",
        description: "Simple single-column design with clear section hierarchy.",
        thumbnail: "",
        premium: false,
        enabled: true,
    },
    {
        title: "Sidebar Right",
        slug: "sidebar-right",
        category: "Modern",
        description: "Right-sidebar layout with contact and skills panel.",
        thumbnail: "",
        premium: false,
        enabled: true,
    },
    {
        title: "Sidebar Left",
        slug: "sidebar-left",
        category: "Modern",
        description: "Left-sidebar layout highlighting profile and expertise.",
        thumbnail: "",
        premium: false,
        enabled: true,
    },
];

@Injectable()
export class TemplatesSeeder {
    constructor(
        @InjectModel(Template.name)
        private readonly templateModel: Model<TemplateDocument>,
    ) { }

    async run() {
        const count = await this.templateModel.countDocuments();

        if (count > 0) {
            console.log("Templates already seeded.");
            return;
        }

        await this.templateModel.insertMany(templates);

        console.log("Templates seeded successfully.");
    }
}
