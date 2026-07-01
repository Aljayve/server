import { Injectable } from "@nestjs/common";
import { ParsedResume } from "../parsers/resume.parser";
import { KeywordAnalysisResult } from "./keyword.analyzer";
import { ScoreAnalysisResult } from "./score.analyzer";

export interface SuggestionResult {
    type: "success" | "warning" | "info";
    title: string;
    description: string;
}

@Injectable()
export class SuggestionAnalyzer {
    analyze(
        resume: ParsedResume,
        keyword: KeywordAnalysisResult,
        score: ScoreAnalysisResult,
    ): SuggestionResult[] {

        const suggestions: SuggestionResult[] = [];

        // Missing Keywords
        if (keyword.missing.length > 0) {
            suggestions.push({
                type: "warning",
                title: "Missing Skills",
                description: `Consider adding these skills if they reflect your experience: ${keyword.missing.join(", ")}.`,
            });
        }

        // Summary
        if (score.summary < 80) {
            suggestions.push({
                type: "info",
                title: "Improve Summary",
                description:
                    "Expand your professional summary with your experience, key skills, and career achievements.",
            });
        }

        // Projects
        if (resume.projects.length < 2) {
            suggestions.push({
                type: "info",
                title: "Add More Projects",
                description:
                    "Include additional projects that demonstrate your technical skills.",
            });
        }

        // Experience
        if (resume.experiences.length < 2) {
            suggestions.push({
                type: "info",
                title: "Strengthen Experience",
                description:
                    "Describe your work experience using measurable achievements whenever possible.",
            });
        }

        // Excellent Resume
        if (
            suggestions.length === 0 &&
            score.overall >= 90
        ) {
            suggestions.push({
                type: "success",
                title: "Excellent Resume",
                description:
                    "Your resume aligns well with the job description. Only minor refinements may be needed.",
            });
        }

        return suggestions;
    }
}