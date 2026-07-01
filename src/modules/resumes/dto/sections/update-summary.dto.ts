import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateSummaryDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(50, {
        message: "Summary should contain at least 50 characters.",
    })
    @MaxLength(2000, {
        message: "Summary cannot exceed 2000 characters.",
    })
    summary: string;
}