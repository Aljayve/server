import { IsMongoId, IsString } from "class-validator";

export class AnalyzeResumeDto {
    @IsMongoId()
    resumeId: string;

    @IsString()
    jobDescription: string;
}