import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateEducationDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    school: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    degree: string;

    @IsString()
    @IsOptional()
    @MaxLength(100)
    fieldOfStudy?: string;

    @IsString()
    @IsOptional()
    @MaxLength(100)
    location?: string;

    @IsString()
    @IsNotEmpty()
    startDate: string;

    @IsString()
    @IsOptional()
    endDate: string;

    @IsBoolean()
    currentlyStudying: boolean;

    @IsString()
    @IsOptional()
    @MaxLength(20)
    gpa?: string;

    @IsString()
    @IsOptional()
    @MaxLength(3000)
    description?: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    achievements?: string[];
}