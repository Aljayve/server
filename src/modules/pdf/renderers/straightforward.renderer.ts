import { ResumeRenderer } from "./renderer.interface";
import { baseStyle, straightforwardStyle } from "../styles";
import { renderPersonalInfo, renderSummary, renderExperience, renderEducation, renderSkills, renderProjects, renderCertifications, renderLanguages } from "./sections";

export class StraightforwardRenderer implements ResumeRenderer {
    render(resume: any): string {
        const awards = resume.awards ?? [];
        const activity = resume.activities ?? {};
        const involvements = activity.involvements ?? [];

        const involvementsHtml = involvements.length
            ? `<section><h2>Involvements</h2>${involvements.map((i: any) => `
                <div class="involvement-item">${this.esc(typeof i === "string" ? i : i.name || "")}</div>`).join("")}</section>`
            : "";

        const awardsHtml = awards.length
            ? `<section><h2>Awards</h2>${awards.map((a: any) => `
                <div class="award-item">
                    <span class="award-title">${this.esc(a.title)}</span>
                    ${a.awarder ? `<br/><span style="color:#555;font-size:10px">${this.esc(a.awarder)}</span>` : ""}
                </div>`).join("")}</section>`
            : "";

        const sidebarContent = [
            renderEducation(resume.education),
            renderSkills(resume.skills),
            renderCertifications(resume.certifications),
            renderLanguages(resume.languages),
            awardsHtml,
        ].filter(s => s.trim()).join("");

        const mainContent = [
            renderPersonalInfo(resume.personalInfo ?? {}),
            renderSummary(resume.personalInfo?.summary),
            renderExperience(resume.experience),
            involvementsHtml,
        ].filter(s => s.trim()).join("");

        const hasSidebar = !!sidebarContent.trim();
        const hasMain = !!mainContent.trim();

        if (hasSidebar && hasMain) {
            return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><style>${baseStyle}${straightforwardStyle}</style></head>
<body>
    <div class="grid">
        <aside class="sidebar">${sidebarContent}</aside>
        <main class="main">${mainContent}</main>
    </div>
</body>
</html>`;
        }

        return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><style>${baseStyle}${straightforwardStyle}</style></head>
<body>
    <div>${sidebarContent}${mainContent}</div>
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
