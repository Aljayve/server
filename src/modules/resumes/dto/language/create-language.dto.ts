import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateLanguageDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name: string;

    @IsString()
    @IsOptional()
    @MaxLength(50)
    proficiency?: string;

    @IsString()
    @IsOptional()
    @MaxLength(50)
    reading?: string;

    @IsString()
    @IsOptional()
    @MaxLength(50)
    writing?: string;

    @IsString()
    @IsOptional()
    @MaxLength(50)
    speaking?: string;

    @IsString()
    @IsOptional()
    @MaxLength(50)
    listening?: string;

    @IsString()
    @IsOptional()
    @MaxLength(200)
    certificate?: string;
}
