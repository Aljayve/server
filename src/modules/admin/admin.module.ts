import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Resume, ResumeSchema } from '../resumes/schemas/resume.schema';
import { CoverLetter, CoverLetterSchema } from '../cover-letters/schemas/cover-letter.schema';
import { Template, TemplateSchema } from '../templates/schemas/template.schema';
import { AppSettings, AppSettingsSchema } from './schemas/app-settings.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Resume.name, schema: ResumeSchema },
            { name: CoverLetter.name, schema: CoverLetterSchema },
            { name: Template.name, schema: TemplateSchema },
            { name: AppSettings.name, schema: AppSettingsSchema },
        ]),
    ],
    controllers: [AdminController],
    providers: [AdminService],
})
export class AdminModule { }
