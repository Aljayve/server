import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type AppSettingsDocument = HydratedDocument<AppSettings>;

@Schema({ timestamps: true })
export class AppSettings {
    @Prop({ default: "ResumeAI" })
    siteName: string;

    @Prop({ default: "support@resumeai.com" })
    supportEmail: string;

    @Prop({ default: "English" })
    defaultLanguage: string;

    @Prop({ default: "OpenAI" })
    aiProvider: string;

    @Prop({ default: "" })
    aiApiKey: string;

    @Prop({ default: true })
    aiEnabled: boolean;

    @Prop({ default: "" })
    aiCustomBaseUrl: string;

    @Prop({ default: "" })
    aiCustomModel: string;

    @Prop({ default: 10 })
    maxResumesPerUser: number;

    @Prop({ default: "Modern Professional" })
    defaultTemplate: string;

    @Prop({ default: true })
    enableATSScore: boolean;

    @Prop({ default: 10 })
    maxFileSize: number;

    @Prop({ type: [String], default: ["PDF", "DOCX", "PNG", "JPG"] })
    allowedFormats: string[];

    @Prop({ default: false })
    enableCompression: boolean;

    @Prop({ default: true })
    allowRegistration: boolean;

    @Prop({ default: true })
    requireEmailVerification: boolean;

    @Prop({ default: false })
    enableTwoFactor: boolean;
}

export const AppSettingsSchema = SchemaFactory.createForClass(AppSettings);
