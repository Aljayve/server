import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ _id: false })
export class Experience {
    @Prop({ default: "" })
    company: string;

    @Prop({ default: "" })
    position: string;

    @Prop({ default: "" })
    employmentType: string;

    @Prop({ default: "" })
    location: string;

    @Prop({ default: "" })
    startDate: string;

    @Prop({ default: "" })
    endDate: string;

    @Prop({ default: false })
    currentlyWorking: boolean;

    @Prop({ default: "" })
    description: string;

    @Prop({ type: [String], default: [] })
    achievements: string[];

    @Prop({ type: [String], default: [] })
    technologies: string[];
}

export const ExperienceSchema = SchemaFactory.createForClass(Experience);
