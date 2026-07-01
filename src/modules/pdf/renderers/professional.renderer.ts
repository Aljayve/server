import { ResumeRenderer } from "./renderer.interface";
import { baseStyle, professionalStyle } from "../styles";
import { renderPersonalInfo, renderSummary, renderExperience, renderEducation, renderSkills, renderProjects, renderCertifications, renderLanguages } from "./sections";

export class ProfessionalRenderer implements ResumeRenderer {
    render(resume: any): string {
        const p = resume.personalInfo ?? {};
        const awards = resume.awards ?? [];
        const activity = resume.activities ?? {};
        const involvements = activity.involvements ?? [];
        const achievements = activity.achievements ?? [];

        const involvementsHtml = involvements.length
            ? `<section class="section"><h2>Key Projects / Involvements</h2>${involvements.map((i: any) => `
                <div class="involvement-item">${this.esc(typeof i === "string" ? i : i.name || "")}</div>`).join("")}</section>`
            : "";

        const achievementsHtml = achievements.length
            ? `<section class="section"><h2>Certificates and Awards</h2>${achievements.map((a: any) => `
                <div class="award-item">${this.esc(typeof a === "string" ? a : a.title || a.name || "")}</div>`).join("")}</section>`
            : "";

        const leftContent = [
            renderPersonalInfo(resume.personalInfo ?? {}),
            renderExperience(resume.experience),
            involvementsHtml,
            achievementsHtml,
        ].filter(s => s.trim()).join("");

        const rightContent = [
            renderSummary(resume.personalInfo?.summary),
            renderSkills(resume.skills),
            renderEducation(resume.education),
            renderCertifications(resume.certifications),
            renderProjects(resume.projects),
            renderLanguages(resume.languages),
        ].filter(s => s.trim()).join("");

        const hasLeft = !!leftContent.trim();
        const hasRight = !!rightContent.trim();
        const useGrid = hasLeft && hasRight;

        const bodyContent = useGrid
            ? `<div class="grid">
        <div class="left">${leftContent}</div>
        <div class="right">${rightContent}</div>
    </div>`
            : `<div>${leftContent}${rightContent}</div>`;

        return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><style>${baseStyle}${professionalStyle}</style></head>
<body>
    ${bodyContent}
</body>
</html>`;
    }

    private esc(s: string): string {
        if (!s) return "";
        return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }

    private fmtDate(d: string): string {
        if (!d) return "Present";
        return d;
    }
}
