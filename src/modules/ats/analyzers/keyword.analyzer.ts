import { Injectable } from "@nestjs/common";
import { ParsedResume } from "../parsers/resume.parser";
import { ParsedJob } from "../parsers/job.parser";
import { SkillsNormalizer } from "../normalizers/skills.normalizer";

export interface KeywordAnalysisResult {
    matched: string[];
    missing: string[];
    extra: string[];
    matchPercentage: number;
}

@Injectable()
export class KeywordAnalyzer {
    constructor(
        private readonly normalizer: SkillsNormalizer,
    ) { }

    analyze(
        resume: ParsedResume,
        job: ParsedJob,
    ): KeywordAnalysisResult {

        const resumeKeywords =
            this.normalizer.normalize(
                this.collectResumeKeywords(resume),
            );

        const jobKeywords =
            this.normalizer.normalize([
                ...job.keywords,
                ...job.requiredSkills,
                ...job.preferredSkills,
            ]);

        const normalizedResume = new Set(resumeKeywords);
        const normalizedJob = new Set(jobKeywords);

        const matched = [...normalizedJob].filter((k) =>
            normalizedResume.has(k),
        );

        const missing = [...normalizedJob].filter(
            (k) => !normalizedResume.has(k),
        );

        const extra = [...normalizedResume].filter(
            (k) => !normalizedJob.has(k),
        );

        const percentage =
            normalizedJob.size === 0
                ? 0
                : Math.round(
                    (matched.length / normalizedJob.size) * 100,
                );

        return {
            matched,
            missing,
            extra,
            matchPercentage: percentage,
        };
    }

    private readonly stopWords = new Set([
        "the", "and", "for", "with", "about", "from", "that", "this",
        "are", "was", "were", "been", "have", "has", "had", "not",
        "but", "all", "can", "out", "its", "also", "just", "than",
        "then", "them", "they", "their", "what", "when", "where",
        "which", "who", "will", "would", "could", "should", "into",
        "over", "such", "each", "well", "very", "more", "some",
        "any", "new", "one", "two", "way", "use", "used", "using",
        "via", "inc", "ltd", "llc", "corp",
    ]);

    private readonly noiseWords = new Set([
        "looking", "results", "oriented", "years", "experience",
        "building", "proficient", "passionate", "clean", "code",
        "delivering", "exceptional", "junior", "senior", "led",
        "team", "based", "reducing", "implemented", "built",
        "maintained", "reduced", "page", "load", "times", "lazy",
        "loading", "startup", "labs", "collaborated", "designers",
        "implement", "pixel", "perfect", "components", "university",
        "bachelor", "featured", "collaboration",
    ]);

    private collectResumeKeywords(
        resume: ParsedResume,
    ): string[] {

        return [

            resume.summary,

            ...resume.skills,

            ...resume.experiences,

            ...resume.education,

            ...resume.projects,

            ...resume.certifications,

            ...resume.languages,

        ]
            .join(" ")
            .replace(/[^\w\s]/g, " ")
            .split(/\s+/)
            .filter((word) => {
                const lower = word.toLowerCase();
                return lower.length > 2
                    && !this.stopWords.has(lower)
                    && !this.noiseWords.has(lower);
            });
    }
}