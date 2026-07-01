import { Injectable } from "@nestjs/common";
import { SkillsDictionary } from "../data/skills.dictionary";

export interface ParsedJob {
    keywords: string[];
    requiredSkills: string[];
    preferredSkills: string[];
    responsibilities: string[];
}

const TECH_INDICATORS = /[A-Z0-9#+.-]/;

const GENERIC_WORDS = new Set([
    "and", "the", "for", "with", "from", "that", "this", "are",
    "was", "were", "been", "have", "has", "had", "not", "but",
    "all", "can", "out", "its", "also", "just", "than", "then",
    "them", "they", "their", "what", "when", "where", "which",
    "who", "will", "would", "could", "should", "into", "over",
    "such", "each", "well", "very", "more", "some", "any", "new",
    "one", "two", "way", "use", "used", "using", "via", "inc",
    "ltd", "llc", "corp", "looking", "seeking", "required",
    "preferred", "must", "should", "experience", "experienced",
    "years", "year", "ability", "knowledge", "build", "building",
    "develop", "developed", "developer", "application",
    "applications", "work", "working", "team", "good", "strong",
    "excellent", "skills", "including", "related", "field",
    "plus", "minimum", "qualifications", "qualification",
    "responsibilities", "responsibility", "requirements",
    "requirement", "description", "about", "position", "role",
    "job", "full", "time", "part", "remote", "hybrid", "office",
    "location", "salary", "range", "pay", "base", "bonus",
    "equity", "benefits", "company", "industry", "environment",
    "fast", "paced", "growing", "startup", "established",
    "leading", "global", "fortune", "top", "best", "great",
    "ideal", "candidate", "join", "opportunity", "duties",
    "tasks", "daily", "perform", "responsible", "manage",
    "management", "support", "provide", "create", "creating",
    "design", "designing", "implement", "implementing",
    "maintain", "maintaining", "test", "testing", "deploy",
    "deploying", "write", "writing", "code", "coding",
    "program", "programming", "software", "engineering",
    "engineer", "scientist", "analyst", "analytics",
    "platform", "system", "systems", "infrastructure",
    "architecture", "solution", "solutions", "service",
    "services", "product", "products", "feature", "features",
    "project", "projects", "process", "processes",
    "improve", "improving", "optimize", "optimizing",
    "scale", "scalable", "secure", "security", "reliable",
    "reliability", "performance", "efficient", "efficiency",
    "quality", "ensure", "ensuring", "across", "within",
    "between", "through", "during", "before", "after",
    "under", "above", "below", "level", "levels", "degree",
    "bachelor", "master", "phd", "preferred", "plus",
    "equivalent", "experience", "years", "year", "month",
    "months", "minimum", "required", "nice", "highly",
    "desired", "prefer", "strongly", "including", "but",
    "limited", "etc", "e.g", "i.e", "ie", "eg",
]);

@Injectable()
export class JobParser {
    parse(jobDescription: string): ParsedJob {
        const normalized = jobDescription
            .replace(/\r\n/g, "\n")
            .toLowerCase();

        const lines = normalized
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean);

        return {
            keywords: this.extractKeywords(jobDescription),
            requiredSkills: this.extractRequiredSkills(lines),
            preferredSkills: this.extractPreferredSkills(lines),
            responsibilities: this.extractResponsibilities(lines),
        };
    }

    private extractKeywords(text: string): string[] {
        const lower = text.toLowerCase();
        const found = new Set<string>();

        const multiWordSkills = Object.entries(SkillsDictionary)
            .filter(([key]) => key.includes(" "));

        for (const [phrase, canonical] of multiWordSkills) {
            if (lower.includes(phrase)) {
                found.add(canonical);
            }
        }

        const words = text
            .replace(/[^\w\s.#+\-]/g, " ")
            .split(/\s+/)
            .filter((w) => w.length >= 2);

        for (const word of words) {
            const lw = word.toLowerCase();

            if (SkillsDictionary[lw]) {
                found.add(SkillsDictionary[lw]);
                continue;
            }

            if (GENERIC_WORDS.has(lw)) continue;
            if (lw.length <= 2) continue;
            if (/^\d+$/.test(lw)) continue;

            if (TECH_INDICATORS.test(word) || lw.length >= 5) {
                found.add(lw);
            }
        }

        return [...found];
    }

    private extractRequiredSkills(lines: string[]): string[] {
        return lines.filter(
            (line) =>
                line.includes("required") ||
                line.includes("must") ||
                line.includes("qualification"),
        );
    }

    private extractPreferredSkills(lines: string[]): string[] {
        return lines.filter(
            (line) =>
                line.includes("preferred") ||
                line.includes("nice to have") ||
                line.includes("plus"),
        );
    }

    private extractResponsibilities(lines: string[]): string[] {
        return lines.filter(
            (line) =>
                line.startsWith("-") ||
                line.startsWith("•"),
        );
    }
}
