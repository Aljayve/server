import { ResumeRenderer } from "./renderer.interface";
import { baseStyle, modernStyle } from "../styles";
import { renderPersonalInfo, renderSummary, renderExperience, renderEducation, renderSkills, renderProjects, renderCertifications, renderLanguages } from "./sections";

export class ModernRenderer implements ResumeRenderer {
    render(resume: any): string {
        const p = resume.personalInfo ?? {};
        const awards = resume.awards ?? [];
        const vol = resume.volunteering ?? [];
        const name = [p.firstName, p.lastName].filter(Boolean).join(" ");

        const awardsHtml = awards.length ? `<section class="section"><h2>Awards</h2>${awards.map((a: any) => `
                <div class="award-item">
                    <span class="award-title">${this.esc(a.title)}</span>
                    ${a.awarder ? ` – <span class="award-detail">${this.esc(a.awarder)}</span>` : ""}
                    ${a.date ? ` <span class="award-detail">(${this.fmtDate(a.date)})</span>` : ""}
                    ${a.summary ? `<div class="job-desc">${this.esc(a.summary)}</div>` : ""}
                </div>`).join("")}</section>` : "";

        const volHtml = vol.length ? `<section class="section"><h2>Volunteer</h2>${vol.map((v: any) => `
                <div class="vol-item">
                    <div class="vol-org">${this.esc(v.organization)}</div>
                    <div class="vol-role">${this.esc(v.position || "")} <span class="vol-date">(${this.fmtDate(v.startDate)} – ${this.fmtDate(v.endDate)})</span></div>
                    ${v.summary ? `<div class="vol-desc">${this.esc(v.summary)}</div>` : ""}
                </div>`).join("")}</section>` : "";

        const leftContent = [
            renderSummary(resume.personalInfo?.summary),
            renderExperience(resume.experience),
            awardsHtml,
        ].filter(s => s.trim()).join("");

        const rightContent = [
            renderEducation(resume.education),
            renderSkills(resume.skills),
            renderCertifications(resume.certifications),
            renderProjects(resume.projects),
            renderLanguages(resume.languages),
            volHtml,
        ].filter(s => s.trim()).join("");

        const hasLeft = !!leftContent.trim();
        const hasRight = !!rightContent.trim();
        const useGrid = hasLeft && hasRight;

        let bodyContent: string;
        if (useGrid) {
            bodyContent = `
    <div class="grid">
        <div class="left">${leftContent}</div>
        <div class="right">${rightContent}</div>
    </div>`;
        } else {
            bodyContent = `<div class="full-width">${leftContent}${rightContent}</div>`;
        }

        return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><style>${baseStyle}${modernStyle}
.full-width { max-width: 100%; }
</style></head>
<body>
    <div class="header">
        <div class="header-left">
            ${renderPersonalInfo(resume.personalInfo ?? {})}
        </div>
        <div class="header-right">
            ${p.photo
                ? `<img class="avatar" src="${p.photo}" alt="photo"/>`
                : name ? `<div class="avatar-placeholder">${name.charAt(0)}</div>` : ""}
        </div>
    </div>
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
