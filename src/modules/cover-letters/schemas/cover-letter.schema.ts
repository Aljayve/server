import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type CoverLetterDocument = HydratedDocument<CoverLetter>;

@Schema({ timestamps: true })
export class CoverLetter {
    @Prop({ type: Types.ObjectId, ref: "User", required: true })
    userId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: "Resume", required: true })
    resumeId: Types.ObjectId;

    @Prop({ required: true })
    jobTitle: string;

    @Prop({ required: true })
    companyName: string;

    @Prop({ default: "" })
    jobDescription: string;

    @Prop({ required: true })
    content: string;
}

export const CoverLetterSchema = SchemaFactory.createForClass(CoverLetter);
