import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateAwardDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    title: string;

    @IsString()
    @IsOptional()
    date?: string;

    @IsString()
    @IsOptional()
    @MaxLength(150)
    issuer?: string;

    @IsString()
    @IsOptional()
    @MaxLength(3000)
    description?: string;

    @IsString()
    @IsOptional()
    url?: string;
}
