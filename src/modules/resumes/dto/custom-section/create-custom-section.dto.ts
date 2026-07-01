import { IsArray, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

class CustomSectionItem {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    subtitle?: string;

    @IsString()
    @IsOptional()
    date?: string;

    @IsString()
    @IsOptional()
    @MaxLength(5000)
    description?: string;
}

export class CreateCustomSectionDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    title: string;

    @IsArray()
    @IsOptional()
    items?: CustomSectionItem[];
}
