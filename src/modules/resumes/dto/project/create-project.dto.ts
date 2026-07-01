import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength } from "class-validator";

export class CreateProjectDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    name: string;

    @IsString()
    @IsOptional()
    @MaxLength(100)
    role?: string;

    @IsString()
    @IsOptional()
    @MaxLength(150)
    organization?: string;

    @IsString()
    @IsNotEmpty()
    startDate: string;

    @IsString()
    @IsOptional()
    endDate?: string;

    @IsBoolean()
    ongoing: boolean;

    @IsString()
    @IsOptional()
    @MaxLength(5000)
    description?: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    technologies?: string[];

    @IsUrl()
    @IsOptional()
    url?: string;

    @IsUrl()
    @IsOptional()
    repository?: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    achievements?: string[];
}