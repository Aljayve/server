export interface ParsedResume {
    summary: string;

    skills: string[],

    experiences: string[],

    education: string[],

    projects: string[],

    certifications: string[],

    languages: string[],
}

export class ResumeParser {

    parse(content: Record<string, any>): ParsedResume {

        return {

            summary:
                content.personalInfo?.summary ?? "",

            skills:
                content.skills ?? [],

            experiences:
                (content.experience ?? []).map((item: any) =>
                    [
                        item.position,
                        item.company,
                        item.description,
                    ]
                        .filter(Boolean)
                        .join(" "),
                ),

            education:
                (content.education ?? []).map((item: any) =>
                    [
                        item.school,
                        item.degree,
                    ]
                        .filter(Boolean)
                        .join(" "),
                ),

            projects:
                (content.projects ?? []).map((item: any) =>
                    [
                        item.title,
                        item.description,
                    ]
                        .filter(Boolean)
                        .join(" "),
                ),

            certifications:
                (content.certifications ?? []).map((item: any) =>
                    item.name ?? "",
                ),

            languages:
                content.languages ?? [],
        };
    }
}