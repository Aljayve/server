import { Module } from '@nestjs/common';
import { PdfController } from './pdf.controller';
import { PdfService } from './pdf.service';
import { ResumesModule } from '../resumes/resumes.module';

@Module({
    imports: [
        ResumesModule
    ],

    controllers: [PdfController],
    providers: [PdfService],
    exports: [PdfService],
})
export class PdfModule { }
