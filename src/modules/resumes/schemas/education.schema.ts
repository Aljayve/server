import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export class Education {
    @Prop({ default: "" })
    school: string;

    @Prop({ default: "" })
    degree: string;

    @Prop({ default: "" })
    fieldOfStudy: string;

    @Prop({ default: "" })
    location: string;

    @Prop({ default: "" })
    startDate: string;

    @Prop({ default: "" })
    endDate: string;

    @Prop({ default: false })
    currentlyStudying: boolean;

    @Prop({ default: "" })
    gpa: string;

    @Prop({ default: "" })
    description: string;

    @Prop({ type: [String], default: [] })
    achievements: string[];
}

export const EducationSchema = SchemaFactory.createForClass(Education);
