import { Injectable, NotFoundException } from '@nestjs/common';
import { ResumesService } from '../resumes/resumes.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class JobMatcherService {
    constructor(
        private readonly resumesService: ResumesService,
        private readonly aiService: AiService,
    ) { }

    async match(userId: string, resumeId: string, jobDescription: string) {
        const resume = await this.resumesService.findOne(resumeId, userId);
        const skills = resume.content?.skills ?? [];
        const summary = resume.content?.summary ?? '';
        const experiences = resume.content?.experiences ?? [];

        const aiAvailable = await this.aiService.isAvailable();

        if (aiAvailable) {
            try {
                return await this.analyzeWithAi(skills, summary, experiences, jobDescription);
            } catch {
                return this.analyzeBasic(skills, jobDescription);
            }
        }

        return this.analyzeBasic(skills, jobDescription);
    }

    private async analyzeWithAi(
        skills: string[],
        summary: string,
        experiences: any[],
        jobDescription: string,
    ) {
        const prompt = `Analyze this job match:

Candidate Skills: ${skills.join(", ")}
Summary: ${summary}
Experience: ${experiences.map((e: any) => `${e.title || e.position} at ${e.company}`).join("; ")}
Job Description: ${jobDescription}

Return JSON:
{
  "matchPercentage": number (0-100),
  "matchingSkills": string[],
  "missingSkills": string[],
  "suggestions": string[]
}`;

        const raw = await this.aiService.generateText(prompt, {
            systemPrompt: "You are a job matching expert. Analyze resume-job fit and return JSON only.",
            maxTokens: 1024,
            temperature: 0.3,
        });

        return JSON.parse(raw);
    }

    private analyzeBasic(skills: string[], jobDescription: string) {
        const jobWords = jobDescription.toLowerCase().split(/\W+/).filter(w => w.length > 3);
        const jobSkills = [...new Set(jobWords)];

        const skillSet = skills.map(s => s.toLowerCase().trim());
        const matchingSkills = jobSkills.filter(jw =>
            skillSet.some(ss => ss.includes(jw) || jw.includes(ss))
        );
        const missingSkills = jobSkills.filter(jw =>
            !skillSet.some(ss => ss.includes(jw) || jw.includes(ss))
        ).slice(0, 10);

        return {
            matchPercentage: Math.round((matchingSkills.length / Math.max(jobSkills.length, 1)) * 100),
            matchingSkills: [...new Set(matchingSkills)],
            missingSkills: [...new Set(missingSkills)],
            suggestions: missingSkills.length > 0
                ? ["Consider adding these missing skills to your resume if you have them."]
                : ["Your resume covers many of the mentioned skills."],
        };
    }
}
