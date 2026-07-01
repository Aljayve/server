import { Injectable } from "@nestjs/common";
import { KeywordAnalysisResult } from "../analyzers/keyword.analyzer";

@Injectable()
export class PriorityEngine {

    analyze(
        keyword: KeywordAnalysisResult,
    ): string[] {

        const fixes: string[] = [];

        keyword.missing.forEach(skill => {

            fixes.push(
                `Add "${skill}" if you have experience using it.`
            );

        });

        if (fixes.length === 0) {

            fixes.push(
                "Maintain your current resume quality and keep it updated."
            );

        }

        return fixes;

    }

}