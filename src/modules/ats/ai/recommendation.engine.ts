import { Injectable } from "@nestjs/common";
import { ScoreAnalysisResult } from "../analyzers/score.analyzer";

@Injectable()
export class RecommendationEngine {

    analyze(
        score: ScoreAnalysisResult,
    ): string {

        if (score.overall >= 90) {

            return "Excellent ATS compatibility. Continue tailoring your resume to each job description.";

        }

        if (score.overall >= 80) {

            return "Good ATS score. Minor improvements can increase your chances.";

        }

        if (score.overall >= 70) {

            return "Your resume is competitive, but adding more relevant skills and achievements is recommended.";

        }

        return "Significant improvements are recommended before submitting this resume.";

    }

}