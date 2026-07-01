import { IsEmail, IsOptional, IsString, IsUrl, MaxLength } from "class-validator";

export class UpdatePersonalInfoDto {
    @IsOptional()
    @IsString()
    @MaxLength(100)
    firstName?: string;


    @IsOptional()
    @IsString()
    @MaxLength(100)
    lastName?: string;

    @IsOptional()
    @IsString()
    @MaxLength(150)
    label?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    @MaxLength(30)
    phone?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    country?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    city?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    address?: string;

    @IsOptional()
    @IsString()
    @MaxLength(20)
    postalCode?: string;

    @IsOptional()
    @IsUrl()
    website?: string;

    @IsOptional()
    @IsUrl()
    linkedin?: string;

    @IsOptional()
    @IsUrl()
    github?: string;

    @IsOptional()
    @IsUrl()
    portfolio?: string;

    @IsOptional()
    @IsUrl()
    photo?: string;
}