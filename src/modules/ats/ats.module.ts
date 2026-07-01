import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AtsController } from './ats.controller';
import { AtsService } from './ats.service';
import { ResumeParser } from './parsers/resume.parser';
import { ResumesModule } from '../resumes/resumes.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { JobParser } from './parsers/job.parser';
import { KeywordAnalyzer } from './analyzers/keyword.analyzer';
import { SkillsNormalizer } from './normalizers/skills.normalizer';
import { ScoreAnalyzer } from './analyzers/score.analyzer';
import { SuggestionAnalyzer } from './analyzers/suggestion.analyzer';
import { AtsReportBuilder } from './reports/ats-report.builder';
import { StrengthsEngine } from './ai/strengths.engine';
import { WeaknessesEngine } from './ai/weaknesses.engine';
import { RecommendationEngine } from './ai/recommendation.engine';
import { PriorityEngine } from './ai/priority.engine';
import { AiEnhancerService } from './ai/ai-enhancer.service';
import { AppSettings, AppSettingsSchema } from '../admin/schemas/app-settings.schema';

@Module({
  imports: [
    ResumesModule,
    NotificationsModule,
    MongooseModule.forFeature([{ name: AppSettings.name, schema: AppSettingsSchema }]),
  ],
  controllers: [AtsController],
  providers: [
    ResumeParser,

    JobParser,

    KeywordAnalyzer,

    SkillsNormalizer,

    ScoreAnalyzer,

    SuggestionAnalyzer,

    AtsReportBuilder,

    StrengthsEngine,

    WeaknessesEngine,

    RecommendationEngine,

    PriorityEngine,

    AiEnhancerService,

    AtsService,
  ],
})
export class AtsModule { }
