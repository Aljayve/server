import { IsObject, IsOptional, IsString } from "class-validator";

export class CreateResumeDto {
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    template?: string;

    @IsOptional()
    @IsObject()
    content?: Record<string, any>;
}