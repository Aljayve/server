import { IsBoolean, IsOptional, IsString } from "class-validator";

export class UpdateSettingsDto {

    @IsOptional()
    @IsString()
    theme?: string;

    @IsOptional()
    @IsBoolean()
    emailNotifications?: boolean;

    @IsOptional()
    @IsBoolean()
    exportNotifications?: boolean;

    @IsOptional()
    @IsBoolean()
    atsUpdates?: boolean;

    @IsOptional()
    @IsBoolean()
    interviewReminders?: boolean;

    @IsOptional()
    @IsString()
    defaultTemplates?: string;

    @IsOptional()
    @IsBoolean()
    autoSave?: boolean;

    @IsOptional()
    @IsBoolean()
    atsOptimization?: boolean;
}