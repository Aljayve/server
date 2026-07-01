import { IsMongoId, IsOptional, IsString } from "class-validator";

export class GenerateQuestionsDto {
    @IsMongoId()
    resumeId: string;

    @IsOptional()
    @IsString()
    jobDescription?: string;
}
