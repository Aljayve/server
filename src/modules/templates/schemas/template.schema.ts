import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type TemplateDocument = HydratedDocument<Template>;

@Schema({
    timestamps: true,
})
export class Template {
    @Prop({
        required: true,
        trim: true,
    })
    title: string;

    @Prop({
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    })
    slug: string;

    @Prop({
        default: "General",
    })
    category: string;

    @Prop({
        default: "",
    })
    thumbnail: string;

    @Prop({
        default: "",
    })
    description: string;

    @Prop({
        default: false,
    })
    premium: boolean;

    @Prop({
        default: true,
    })
    enabled: boolean;
}

export const TemplateSchema =
    SchemaFactory.createForClass(Template);