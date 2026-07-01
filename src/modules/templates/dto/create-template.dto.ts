import { IsBoolean, IsOptional, IsString } from "class-validator";

export class CreateTemplateDto {
    @IsString()
    title: string;

    @IsString()
    slug: string;

    @IsOptional()
    @IsString()
    category?: string;

    @IsOptional()
    @IsString()
    thumbnail?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsBoolean()
    premium?: boolean;

    @IsOptional()
    @IsBoolean()
    enabled?: boolean;
}