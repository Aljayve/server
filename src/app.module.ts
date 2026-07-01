import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ResumesModule } from './modules/resumes/resumes.module';
import { TemplatesModule } from './modules/templates/templates.module';
import { SettingsModule } from './modules/settings/settings.module';
import { AtsModule } from './modules/ats/ats.module';
import { JobMatcherModule } from './modules/job-matcher/job-matcher.module';
import { CoverLettersModule } from './modules/cover-letters/cover-letters.module';
import { InterviewModule } from './modules/interview/interview.module';
import { AdminModule } from './modules/admin/admin.module';
import { UploadModule } from './modules/uploads/upload.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { PdfModule } from './modules/pdf/pdf.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { AiModule } from './modules/ai/ai.module';
import databaseConfig from './config/database.config';
import cloudinaryConfig from './config/cloudinary.config';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        databaseConfig,
        cloudinaryConfig
      ],
    }),

    MongooseModule.forRoot(
      process.env.MONGODB_URI as string
    ),

    AuthModule,
    UsersModule,
    ResumesModule,
    TemplatesModule,
    SettingsModule,
    AtsModule,
    JobMatcherModule,
    CoverLettersModule,
    InterviewModule,
    AdminModule,
    SettingsModule,
    UploadModule,
    PdfModule,
    TemplatesModule,
    NotificationsModule,
    PaymentsModule,
    AiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
