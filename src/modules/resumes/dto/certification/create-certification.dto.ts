import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength } from "class-validator";

export class CreateCertificationDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    name: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    issuer: string;

    @IsString()
    @IsNotEmpty()
    issueDate: string;

    @IsString()
    @IsOptional()
    expirationDate?: string;

    @IsBoolean()
    doesNotExpire: boolean;

    @IsString()
    @IsOptional()
    @MaxLength(100)
    credentialId?: string;

    @IsUrl()
    @IsOptional()
    credentialUrl?: string;

    @IsString()
    @IsOptional()
    @MaxLength(3000)
    description?: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    skills?: string[];
}