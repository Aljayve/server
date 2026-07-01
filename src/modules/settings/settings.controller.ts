import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common";
import { SettingsService } from "./settings.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { UpdateSettingsDto } from "./dto/update-settings.dto";

@Controller("settings")
export class SettingsController {
    constructor(
        private readonly settingsService: SettingsService,
    ) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    async getSettings(
        @CurrentUser() user: any,
    ) {
        return this.settingsService.getSettings(
            user.userId,
        );
    }

    @Patch()
    @UseGuards(JwtAuthGuard)
    async updateSettings(
        @CurrentUser() user: any,

        @Body()
        dto: UpdateSettingsDto,
    ) {
        return this.settingsService.updateSettings(
            user.userId,
            dto,
        );
    }
}