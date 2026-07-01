import { KeywordAnalysisResult } from "../analyzers/keyword.analyzer";
import { ScoreAnalysisResult } from "../analyzers/score.analyzer";
import { SuggestionResult } from "../analyzers/suggestion.analyzer";

export interface AtsReport {
    generatedAt: Date;

    keywordAnalysis: KeywordAnalysisResult;

    score: ScoreAnalysisResult;

    suggestions: SuggestionResult[];
}