import { Injectable } from "@nestjs/common";
import { ParsedResume } from "../parsers/resume.parser";
import { KeywordAnalysisResult } from "../analyzers/keyword.analyzer";

@Injectable()
export class WeaknessesEngine {

    analyze(
        resume: ParsedResume,
        keyword: KeywordAnalysisResult,
    ): string[] {

        const weaknesses: string[] = [];

        if (keyword.missing.length > 0) {
            weaknesses.push(
                `Missing important keywords: ${keyword.missing.join(", ")}.`
            );
        }

        if (resume.projects.length === 0) {
            weaknesses.push(
                "No projects section detected."
            );
        }

        if (resume.experiences.length === 0) {
            weaknesses.push(
                "No professional work experience detected."
            );
        }

        if (resume.summary.length < 80) {
            weaknesses.push(
                "Professional summary could be expanded."
            );
        }

        return weaknesses;
    }

}