import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class GenerateCoverLetterDto {
    @IsMongoId()
    resumeId: string;

    @IsString()
    @IsNotEmpty()
    jobTitle: string;

    @IsString()
    @IsNotEmpty()
    companyName: string;

    @IsOptional()
    @IsString()
    jobDescription?: string;
}
