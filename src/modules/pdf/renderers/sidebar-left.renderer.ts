import { ResumeRenderer } from "./renderer.interface";
import { baseStyle, sidebarLeftStyle } from "../styles";
import { renderPersonalInfo, renderSummary, renderExperience, renderEducation, renderSkills, renderProjects, renderCertifications, renderLanguages } from "./sections";

export class SidebarLeftRenderer implements ResumeRenderer {
    render(resume: any): string {
        const p = resume.personalInfo ?? {};
        const awards = resume.awards ?? [];
        const name = [p.firstName, p.lastName].filter(Boolean).join(" ");

        const awardsHtml = awards.length
            ? `<section><h2>Awards</h2>${awards.map((a: any) => `
                <div class="award-item">
                    <span class="award-title">${this.esc(a.title)}</span>
                    ${a.awarder ? ` – <span class="award-detail">${this.esc(a.awarder)}</span>` : ""}
                    ${a.date ? ` <span class="award-detail">(${this.fmtDate(a.date)})</span>` : ""}
                </div>`).join("")}</section>`
            : "";

        const sidebarContent = [
            p.photo
                ? `<img class="avatar" src="${p.photo}" alt="photo"/>`
                : name ? `<div class="avatar-placeholder">${name.charAt(0)}</div>` : "",
            renderPersonalInfo(resume.personalInfo ?? {}),
            renderSkills(resume.skills),
            renderEducation(resume.education),
            renderCertifications(resume.certifications),
            renderLanguages(resume.languages),
        ].filter(s => s.trim()).join("");

        const mainContent = [
            renderSummary(resume.personalInfo?.summary),
            renderExperience(resume.experience),
            renderProjects(resume.projects),
            awardsHtml,
        ].filter(s => s.trim()).join("");

        const hasSidebar = !!sidebarContent.trim();
        const hasMain = !!mainContent.trim();

        if (hasSidebar && hasMain) {
            return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><style>${baseStyle}${sidebarLeftStyle}</style></head>
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
<head><meta charset="UTF-8"><style>${baseStyle}${sidebarLeftStyle}</style></head>
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
