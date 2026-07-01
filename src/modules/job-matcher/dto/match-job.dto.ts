import { IsString, IsNotEmpty } from "class-validator";

export class MatchJobDto {
    @IsString()
    @IsNotEmpty()
    resumeId: string;

    @IsString()
    @IsNotEmpty()
    jobDescription: string;
}
