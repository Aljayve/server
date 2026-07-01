import { Body, Controller, HttpException, HttpStatus, Post, Res } from "@nestjs/common";
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
        try {
            const pdf = await this.pdfService.exportResume(dto);

            res.set({
                "Content-Type": "application/pdf",
                "Content-Disposition": 'attachment; filename="resume.pdf"',
                "Content-Length": pdf.length,
            });

            res.send(pdf);
        } catch (e: any) {
            throw new HttpException(
                e?.message ?? "PDF generation failed",
                e?.message?.includes("not available")
                    ? HttpStatus.NOT_IMPLEMENTED
                    : HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
