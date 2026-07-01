import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export class Project {
    @Prop({ default: "" })
    name: string;

    @Prop({ default: "" })
    role: string;

    @Prop({ default: "" })
    organization: string;

    @Prop({ default: "" })
    startDate: string;

    @Prop({ default: "" })
    endDate: string;

    @Prop({ default: false })
    ongoing: boolean;

    @Prop({ default: "" })
    description: string;

    @Prop({ type: [String], default: [] })
    technologies: string[];

    @Prop({ default: "" })
    url: string;

    @Prop({ default: "" })
    repository: string;

    @Prop({ type: [String], default: [] })
    achievements: string[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
