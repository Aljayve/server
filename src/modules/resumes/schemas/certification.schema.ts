import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


export class Certification {


    @Prop({ default: "" })
    name: string;

    @Prop({ default: "" })
    issuer: string;

    @Prop({ default: "" })
    issueDate: string;

    @Prop({ default: "" })
    expirationDate: string;

    @Prop({ default: false })
    doesNotExpire: boolean;

    @Prop({ default: "" })
    credentialId: string;

    @Prop({ default: "" })
    credentialUrl: string;

    @Prop({ default: "" })
    description: string;

    @Prop({
        type: [String],
        default: [],
    })
    skills: string[];
}

export const CertificationSchema =
    SchemaFactory.createForClass(
        Certification,
    );