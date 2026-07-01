import { IsObject, IsOptional, IsString } from "class-validator";

export class UpdateResumeDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    template?: string;

    @IsOptional()
    @IsObject()
    content?: Record<string, any>;
}