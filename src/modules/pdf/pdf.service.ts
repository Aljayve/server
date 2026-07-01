import { Injectable, NotFoundException } from "@nestjs/common";
import { ExportPdfDto } from "./dto/export-pdf.dto";
import { ResumesService } from "../resumes/resumes.service";
import { RendererFactory } from "./renderers/renderer.factory";
import { generatePdf } from "./helpers/generate-pdf";

@Injectable()
export class PdfService {
    constructor(
        private readonly resumesService: ResumesService,
    ) { }

    async exportResume(dto: ExportPdfDto) {
        const resume =
            await this.resumesService.findById(
                dto.resumeId,
            );

        const renderer =
            RendererFactory.create(
                resume.template,
            );

        const html =
            await renderer.render(
                resume.content,
            );

        const pdf = await generatePdf(html);

        return pdf;
    }
}
