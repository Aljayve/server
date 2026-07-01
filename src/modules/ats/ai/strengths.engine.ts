import { Injectable } from "@nestjs/common";
import { ParsedResume } from "../parsers/resume.parser";
import { ScoreAnalysisResult } from "../analyzers/score.analyzer";

@Injectable()
export class StrengthsEngine {

    analyze(
        resume: ParsedResume,
        score: ScoreAnalysisResult,
    ): string[] {

        const strengths: string[] = [];

        if (score.skills >= 80) {
            strengths.push(
                "Strong alignment with the required technical skills."
            );
        }

        if (resume.projects.length >= 2) {
            strengths.push(
                "Includes multiple technical projects demonstrating practical experience."
            );
        }

        if (resume.experiences.length >= 2) {
            strengths.push(
                "Solid professional experience relevant to the role."
            );
        }

        if (resume.summary.length >= 100) {
            strengths.push(
                "Professional summary is informative and well developed."
            );
        }

        if (resume.certifications.length > 0) {
            strengths.push(
                "Relevant certifications strengthen your professional profile."
            );
        }

        return strengths;
    }

}