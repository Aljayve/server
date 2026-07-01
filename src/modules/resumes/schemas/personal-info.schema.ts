import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ _id: false })
export class PersonalInfo {
    @Prop({ default: "" })
    firstName: string;

    @Prop({ default: "" })
    lastName: string;

    @Prop({ default: "" })
    label: string;

    @Prop({ default: "" })
    email: string;

    @Prop({ default: "" })
    phone: string;

    @Prop({ default: "" })
    country: string;

    @Prop({ default: "" })
    city: string;

    @Prop({ default: "" })
    address: string;

    @Prop({ default: "" })
    postalCode: string;

    @Prop({ default: "" })
    website: string;

    @Prop({ default: "" })
    linkedin: string;

    @Prop({ default: "" })
    github: string;

    @Prop({ default: "" })
    portfolio: string;

    @Prop({ default: "" })
    photo: string;
}

export const PersonalInfoSchema = SchemaFactory.createForClass(PersonalInfo);
