import { IsMongoId } from "class-validator";

export class ExportPdfDto {
    @IsMongoId()
    resumeId: string;
}