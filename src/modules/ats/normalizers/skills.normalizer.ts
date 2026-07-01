import { Injectable } from "@nestjs/common";
import { SkillsDictionary } from "../data/skills.dictionary";
import { StopWords } from "../data/stopwords";

@Injectable()
export class SkillsNormalizer {
    normalize(words: string[]): string[] {
        const normalized = words.map((word) => {
            const key = word.toLowerCase().trim();

            return SkillsDictionary[key] ?? key;
        })
            .filter(word => !StopWords.has(word))
            .filter(word => word.length >= 2);

        return [...new Set(normalized)];
    }
}