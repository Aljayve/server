import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Resume, ResumeSchema } from './schemas';
import { Template, TemplateSchema } from '../templates/schemas/template.schema';
import { ResumesService } from './resumes.service';
import { ResumesController } from './resumes.controller';
import { UploadModule } from '../uploads/upload.module';
import { UsersModule } from '../users/users.module';
import {
    ResumeCrudService,
    PersonalInfoService,
    SummaryService,
    ArraySectionService,
} from './services';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Resume.name,
                schema: ResumeSchema,
            },
            {
                name: Template.name,
                schema: TemplateSchema,
            },
        ]),
        UploadModule,
        UsersModule,
    ],

    controllers: [
        ResumesController,
    ],

    providers: [
        ResumeCrudService,
        PersonalInfoService,
        SummaryService,
        ArraySectionService,
        ResumesService,
    ],

    exports: [
        ResumesService,
    ],
})
export class ResumesModule { }
