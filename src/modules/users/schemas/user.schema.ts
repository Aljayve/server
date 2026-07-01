import {
    Prop,
    Schema,
    SchemaFactory,
} from "@nestjs/mongoose";

import { HydratedDocument } from "mongoose";

import { Role } from "../../../common/constants/role.enum";

import { Status } from "../../../common/constants/status.enum";

export type UserDocument =
    HydratedDocument<User>;

@Schema({
    timestamps: true,
})
export class User {
    @Prop({
        type: String,
        required: true,
        trim: true,
    })
    firstName: string;

    @Prop({
        type: String,
        required: true,
        trim: true,
    })
    lastName: string;

    @Prop({
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    })
    email: string;

    @Prop({
        type: String,
        required: true,
    })
    password: string;

    @Prop({
        type: {
            url: String,
            publicId: String,
        },
        default: {
            url: "",
            publicId: "",
        },
    })
    avatar: {
        url: string;
        publicId: string;
    };

    @Prop({
        type: String,
        enum: Role,
        default: Role.USER,
    })
    role: Role;

    @Prop({
        type: String,
        enum: Status,
        default: Status.ACTIVE,
    })
    status: Status;

    @Prop({
        type: String,
        default: "free",
    })
    plan: string;

    @Prop({
        type: String,
        default: null,
    })
    paymongoSessionId?: string;

    @Prop({
        type: Date,
        default: null,
    })
    planExpiresAt?: Date;

    @Prop({
        type: Date,
        default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    })
    usageResetAt: Date;

    @Prop({
        type: String,
        trim: true,
    })
    headline?: string;

    @Prop({
        type: String,
        trim: true,
    })
    phone?: string;

    @Prop({
        type: String,
        trim: true,
    })
    location?: string;

    @Prop({
        type: String,
        trim: true,
    })
    linkedinUrl?: string;

    @Prop({
        type: String,
        trim: true,
    })
    website?: string;
}

export const UserSchema =
    SchemaFactory.createForClass(User);