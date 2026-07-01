import { Injectable } from "@nestjs/common";
import { ParsedResume } from "../parsers/resume.parser";
import { KeywordAnalysisResult } from "./keyword.analyzer";

export interface ScoreAnalysisResult {
    overall: number;

    skills: number;

    experience: number;

    projects: number;

    education: number;

    summary: number;

}

@Injectable()
export class ScoreAnalyzer {

    analyze(
        resume: ParsedResume,
        keyword: KeywordAnalysisResult,
    ): ScoreAnalysisResult {

        const skills = keyword.matchPercentage;

        const experience = this.calculateExperienceScore(resume);

        const projects = this.calculateProjectsScore(resume);

        const education = this.calculateEducationScore(resume);

        const summary = this.calculateSummaryScore(resume);

        const overall = Math.round(
            skills * 0.40 +
            experience * 0.25 +
            projects * 0.15 +
            education * 0.10 +
            summary * 0.10,
        );

        return {
            overall,
            skills,
            experience,
            projects,
            education,
            summary,
        };
    }

    private calculateExperienceScore(resume: ParsedResume): number {
        const count = resume.experiences.length;

        if (count >= 3) return 100;
        if (count === 2) return 85;
        if (count === 1) return 70;

        return 0;
    }

    private calculateProjectsScore(resume: ParsedResume): number {
        const count = resume.projects.length;

        if (count >= 3) return 100;
        if (count === 2) return 85;
        if (count === 1) return 70;

        return 0;
    }

    private calculateEducationScore(resume: ParsedResume): number {
        const count = resume.education.length;

        if (count >= 2) return 100;
        if (count === 1) return 90;

        return 0;
    }

    private calculateSummaryScore(resume: ParsedResume): number {
        const summary = resume.summary.trim();

        if (!summary) return 0;

        if (summary.length >= 200) return 100;

        if (summary.length >= 120) return 90;

        if (summary.length >= 60) return 75;

        return 50;
    }
}