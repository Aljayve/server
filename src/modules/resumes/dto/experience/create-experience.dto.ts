import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateExperienceDto {

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    company: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    position: string;

    @IsString()
    @IsOptional()
    @MaxLength(50)
    employmentType?: string;

    @IsString()
    @IsOptional()
    @MaxLength(100)
    location?: string;

    @IsString()
    @IsNotEmpty()
    startDate: string;

    @IsString()
    @IsOptional()
    endDate?: string;

    @IsBoolean()
    currentlyWorking: boolean;

    @IsString()
    @IsOptional()
    @MaxLength(3000)
    description?: string;

    @IsArray()
    @IsOptional()
    achievements?: string[];

    @IsArray()
    @IsOptional()
    technologies?: string[];
}