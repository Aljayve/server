import { Injectable } from "@nestjs/common";
import { KeywordAnalysisResult } from "../analyzers/keyword.analyzer";
import { ScoreAnalysisResult } from "../analyzers/score.analyzer";
import { SuggestionResult } from "../analyzers/suggestion.analyzer";
import { AtsReport } from "./ats-report.interface";

@Injectable()
export class AtsReportBuilder {
    build(
        keyword: KeywordAnalysisResult,
        score: ScoreAnalysisResult,
        suggestions: SuggestionResult[],
    ): AtsReport {
        return {
            generatedAt: new Date(),

            keywordAnalysis: keyword,

            score,

            suggestions,
        };
    }
}