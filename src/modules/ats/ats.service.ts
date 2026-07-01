import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AnalyzeResumeDto } from "./dto/analyze-resume.dto";
import { ResumeParser } from "./parsers/resume.parser";
import { ResumesService } from "../resumes/resumes.service";
import { JobParser } from "./parsers/job.parser";
import { KeywordAnalyzer } from "./analyzers/keyword.analyzer";
import { ScoreAnalyzer } from "./analyzers/score.analyzer";
import { SuggestionAnalyzer } from "./analyzers/suggestion.analyzer";
import { AtsReportBuilder } from "./reports/ats-report.builder";
import { AiEnhancerService } from "./ai/ai-enhancer.service";
import { NotificationsService } from "../notifications/notifications.service";
import { AppSettings } from "../admin/schemas/app-settings.schema";

@Injectable()
export class AtsService {

    constructor(
        @InjectModel(AppSettings.name) private readonly appSettingsModel: Model<AppSettings>,
        private readonly resumesService: ResumesService,
        private readonly parser: ResumeParser,
        private readonly jobParser: JobParser,
        private readonly keywordAnalyzer: KeywordAnalyzer,
        private readonly scoreAnalyzer: ScoreAnalyzer,
        private readonly suggestionAnalyzer: SuggestionAnalyzer,
        private readonly reportBuilder: AtsReportBuilder,
        private readonly aiEnhancer: AiEnhancerService,
        private readonly notifications: NotificationsService,
    ) { }

    async analyze(userId: string, dto: AnalyzeResumeDto) {
        const settings = await this.appSettingsModel.findOne().lean().exec();
        if (settings && !settings.enableATSScore) {
            throw new ForbiddenException('ATS analysis has been disabled by the administrator');
        }

        const resume = await this.resumesService.findOne(dto.resumeId, userId);

        const parsedResume = this.parser.parse(resume.content);

        const parsedJob = this.jobParser.parse(dto.jobDescription);

        let keywordAnalysis;

        try {
            keywordAnalysis = await this.aiEnhancer.analyzeKeywords(
                parsedResume.skills,
                dto.jobDescription,
            );
        } catch {
            keywordAnalysis =
                this.keywordAnalyzer.analyze(
                    parsedResume,
                    parsedJob,
                );
        }

        const score =
            this.scoreAnalyzer.analyze(
                parsedResume,
                keywordAnalysis,
            );

        const suggestions = this.suggestionAnalyzer.analyze(
            parsedResume,
            keywordAnalysis,
            score,
        );

        const report = this.reportBuilder.build(
            keywordAnalysis,
            score,
            suggestions,
        );

        this.resumesService.updateAtsScore(dto.resumeId, score.overall);

        this.notifications.create({
            userId: resume.userId.toString(),
            title: "ATS Analysis Complete",
            message: `"${resume.title}" scored ${score.overall}%. ${score.overall >= 80 ? "Great job!" : "Check suggestions to improve."}`,
            type: score.overall >= 80 ? "success" : "warning",
        });

        const ai = await this.aiEnhancer.analyze(
            parsedResume,
            keywordAnalysis,
            score,
        )

        return {
            ...report,
            ai,
        }
    }
}
