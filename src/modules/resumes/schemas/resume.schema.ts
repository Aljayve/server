import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Schema as MongooseSchema } from "mongoose";

import { PersonalInfo, PersonalInfoSchema } from "./personal-info.schema";
import { Experience, ExperienceSchema } from "./experience.schema";
import { Education, EducationSchema } from "./education.schema";
import { Project, ProjectSchema } from "./project.schema";
import { Certification, CertificationSchema } from "./certification.schema";
import type { Award } from "../dto/award/award.interface";
import type { Reference } from "../dto/reference/reference.interface";
import type { CustomSection } from "../dto/custom-section/custom-section.interface";
import type { Language } from "../dto/language/language.interface";

export type ResumeDocument = HydratedDocument<Resume>;

@Schema({ timestamps: true })
export class Resume {
    @Prop({ type: Types.ObjectId, ref: "User", required: true })
    userId: Types.ObjectId;

    @Prop({ required: true })
    title: string;

    @Prop({ default: "ats-classic" })
    template: string;

    @Prop({ default: 0 })
    atsScore: number;

    @Prop({
        type: {
            personalInfo: {
                type: PersonalInfoSchema,
                default: () => ({}),
            },
            summary: { type: String, default: "" },
            experiences: { type: [ExperienceSchema], default: [] },
            education: { type: [EducationSchema], default: [] },
            projects: { type: [ProjectSchema], default: [] },
            skills: { type: [String], default: [] },
            certifications: { type: [CertificationSchema], default: [] },
            languages: { type: [MongooseSchema.Types.Mixed], default: [] },
            awards: { type: [MongooseSchema.Types.Mixed], default: [] },
            references: { type: [MongooseSchema.Types.Mixed], default: [] },
            customSections: { type: [MongooseSchema.Types.Mixed], default: [] },
        },
        default: () => ({}),
    })
    content: {
        personalInfo: PersonalInfo;
        summary: string;
        experiences: Experience[];
        education: Education[];
        projects: Project[];
        skills: string[];
        certifications: Certification[];
        languages: Language[];
        awards: Award[];
        references: Reference[];
        customSections: CustomSection[];
    };

    @Prop({ default: false })
    isArchived: boolean;
}

export const ResumeSchema = SchemaFactory.createForClass(Resume);
