import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import {
    UserSettings,
    UserSettingsDocument,
} from "./schemas/user-settings.schema";
import { Model } from "mongoose";
import { UpdateSettingsDto } from "./dto/update-settings.dto";

@Injectable()
export class SettingsService {
    constructor(
        @InjectModel(UserSettings.name)
        private readonly settingsModel: Model<UserSettingsDocument>,
    ) { }

    async getSettings(userId: string) {
        let settings =
            await this.settingsModel.findOne({
                userId,
            });

        if (!settings) {
            settings =
                await this.settingsModel.create({
                    userId,
                });
        }

        return settings;
    }


    async updateSettings(
        userId: string,
        dto: UpdateSettingsDto,
    ) {
        let settings =
            await this.settingsModel.findOne({
                userId,
            });

        if (!settings) {
            settings =
                await this.settingsModel.create({
                    userId,
                });
        }

        return this.settingsModel.findOneAndUpdate(
            {
                userId,
            },
            dto,
            {
                returnDocument: 'after',
            },
        );
    }
}