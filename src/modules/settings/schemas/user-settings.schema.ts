import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type UserSettingsDocument =
    HydratedDocument<UserSettings>;

@Schema({
    timestamps: true,
})
export class UserSettings {

    @Prop({
        type: Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    })
    userId: Types.ObjectId;

    @Prop({
        default: "dark",
    })
    theme: string;

    @Prop({
        default: true,
    })
    emailNotifications: boolean;

    @Prop({
        default: true,
    })
    exportNotifications: boolean;

    @Prop({
        default: true,
    })
    atsUpdate: boolean;

    @Prop({
        default: false,
    })
    interviewReminders: boolean;

    @Prop({
        default: "ATS Classic",
    })
    defaultTemplate: string;

    @Prop({
        default: "PDF",
    })
    exportFormat: string;

    @Prop({
        default: true,
    })
    autoSave: boolean;

    @Prop({
        default: true,
    })
    atsOptimization: boolean;
}

export const UserSettingsSchema =
    SchemaFactory.createForClass(
        UserSettings,
    );