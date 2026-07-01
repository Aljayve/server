import { Injectable } from "@nestjs/common";

import { ParsedResume } from "../parsers/resume.parser";
import { KeywordAnalysisResult } from "../analyzers/keyword.analyzer";
import { ScoreAnalysisResult } from "../analyzers/score.analyzer";

import { StrengthsEngine } from "./strengths.engine";
import { WeaknessesEngine } from "./weaknesses.engine";
import { RecommendationEngine } from "./recommendation.engine";
import { PriorityEngine } from "./priority.engine";

import { AiResponse } from "./ai-response.interface";
import { AiService } from "../../ai/ai.service";

export interface AiKeywordResult {
    matched: string[];
    missing: string[];
    matchPercentage: number;
}

@Injectable()
export class AiEnhancerService {

    constructor(
        private readonly strengths: StrengthsEngine,
        private readonly weaknesses: WeaknessesEngine,
        private readonly recommendation: RecommendationEngine,
        private readonly priority: PriorityEngine,
        private readonly aiService: AiService,
    ) { }

    async analyze(
        resume: ParsedResume,
        keyword: KeywordAnalysisResult,
        score: ScoreAnalysisResult,
    ): Promise<AiResponse> {
        const ruleBased = {
            strengths: this.strengths.analyze(resume, score),
            weaknesses: this.weaknesses.analyze(resume, keyword),
            priorityFixes: this.priority.analyze(keyword),
            recommendation: this.recommendation.analyze(score),
        };

        if (await this.aiService.isAvailable()) {
            try {
                const aiResult = await this.callAi(resume, keyword, score);
                return aiResult;
            } catch {
                return ruleBased;
            }
        }

        return ruleBased;
    }

    async analyzeKeywords(
        resumeSkills: string[],
        jobDescription: string,
    ): Promise<AiKeywordResult> {
        if (!(await this.aiService.isAvailable())) {
            throw new Error("AI service not available");
        }

        const prompt = `Extract ONLY real technical skills and technologies from this job description. Return ONLY skills that are:
- Programming languages (e.g. PHP, JavaScript, Python, TypeScript)
- Frameworks and libraries (e.g. React, Node.js, Angular, Django)
- Databases (e.g. MySQL, MongoDB, PostgreSQL)
- Tools and platforms (e.g. Docker, AWS, Git, CMS platforms)
- Technical concepts (e.g. REST API, CI/CD, Agile)

Do NOT include:
- Generic action words (developing, troubleshooting, maintaining)
- Soft skills (analytical, problem-solving, team player)
- General nouns (team, city, company, project, system)
- Filler words (fresh, graduate, welcome, willing, start, ASAP)

Job Description:
${jobDescription}

Respond in JSON format ONLY:
{
  "extractedSkills": ["skill1", "skill2", ...]
}`;

        const raw = await this.aiService.generateText(prompt, {
            systemPrompt: "You are an expert ATS skill extractor. Extract ONLY real technical skills, ignore generic words. Return JSON only.",
            maxTokens: 1024,
            temperature: 0.2,
        });

        const parsed = JSON.parse(raw);
        const extracted: string[] = parsed.extractedSkills ?? [];

        const { matched, missing } = this.matchExtractedSkills(resumeSkills, extracted);

        return {
            matched,
            missing,
            matchPercentage: extracted.length > 0
                ? Math.round((matched.length / extracted.length) * 100)
                : 0,
        };
    }

    private matchExtractedSkills(
        resumeSkills: string[],
        extractedSkills: string[],
    ): { matched: string[]; missing: string[] } {
        const normalize = (s: string) =>
            s.toLowerCase().replace(/[^a-z0-9]/g, "");

        const normalizedResume = resumeSkills.map(normalize);

        const matched: string[] = [];
        const missing: string[] = [];

        for (const skill of extractedSkills) {
            const ns = normalize(skill);
            if (ns.length < 3) {
                missing.push(skill);
                continue;
            }
            const found = normalizedResume.some((nr) =>
                nr.length >= 3 &&
                (nr.includes(ns) || ns.includes(nr))
            );
            if (found) {
                matched.push(skill);
            } else {
                missing.push(skill);
            }
        }

        return { matched, missing };
    }

    private async callAi(
        resume: ParsedResume,
        keyword: KeywordAnalysisResult,
        score: ScoreAnalysisResult,
    ): Promise<AiResponse> {
        const prompt = `Analyze this resume and job description match:

Resume Summary: ${resume.summary || "N/A"}
Skills: ${resume.skills.join(", ")}
Experience: ${resume.experiences.map((e: any) => `${e.title} at ${e.company}`).join("; ")}
Projects: ${resume.projects.map((p: any) => p.name).join(", ")}
Matched Keywords: ${keyword.matched.join(", ")}
Missing Keywords: ${keyword.missing.join(", ")}
Match Percentage: ${keyword.matchPercentage}%
Score: Skills=${score.skills}, Experience=${score.experience}, Education=${score.education}, Projects=${score.projects}, Summary=${score.summary}

Respond in JSON format:
{
  "strengths": ["strength1", "strength2", ...],
  "weaknesses": ["weakness1", "weakness2", ...],
  "priorityFixes": ["fix1", "fix2", ...],
  "recommendation": "One paragraph recommendation"
}`;

        const raw = await this.aiService.generateText(prompt, {
            systemPrompt: "You are an expert ATS resume analyzer. Provide concise, actionable analysis in JSON format only.",
            maxTokens: 1024,
            temperature: 0.3,
        });

        return JSON.parse(raw);
    }
}
