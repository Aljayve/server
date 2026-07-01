import { Body, Controller, Post, Res } from "@nestjs/common";
import { PdfService } from "./pdf.service";
import { ExportPdfDto } from "./dto/export-pdf.dto";
import type { Response } from "express";

@Controller("pdf")
export class PdfController {
    constructor(
        private readonly pdfService: PdfService,
    ) { }

    @Post("export")
    async exportPdf(
        @Body() dto: ExportPdfDto,
        @Res() res: Response,
    ) {
        const pdf = await this.pdfService.exportResume(dto);

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": 'attachment; filename="resume.pdf"',
            "Content-Length": pdf.length,
        });

        res.send(pdf);
    }
}
