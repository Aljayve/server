import { ResumeRenderer } from "./renderer.interface";
import { baseStyle, technicalStyle } from "../styles";
import { renderPersonalInfo, renderSummary, renderExperience, renderEducation, renderSkills, renderProjects, renderCertifications, renderLanguages } from "./sections";

export class TechnicalRenderer implements ResumeRenderer {
    render(resume: any): string {
        const p = resume.personalInfo ?? {};
        const name = [p.firstName, p.lastName].filter(Boolean).join(" ");

        const contactParts = [p.email, p.phone, p.city, p.url]
            .filter(Boolean)
            .map(v => `<span>${this.esc(v)}</span>`)
            .join("");

        const col1Content = [
            renderSummary(resume.personalInfo?.summary),
            renderExperience(resume.experience),
            renderProjects(resume.projects),
        ].filter(s => s.trim()).join("");

        const asideContent = [
            renderLanguages(resume.languages),
            renderSkills(resume.skills),
            renderEducation(resume.education),
            renderCertifications(resume.certifications),
        ].filter(s => s.trim()).join("");

        const hasCol1 = !!col1Content.trim();
        const hasAside = !!asideContent.trim();

        const gridHtml = (hasCol1 && hasAside)
            ? `<div class="grid">
        <div>${col1Content}</div>
        <aside>${asideContent}</aside>
    </div>`
            : `<div>${col1Content}${asideContent}</div>`;

        return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><style>${baseStyle}${technicalStyle}</style></head>
<body>
    <div class="header">
        ${p.label || name ? `<div class="tag">&lt;hello /&gt;</div>
        <div class="comment">// ${this.esc(p.label || name)}</div>` : ""}
        ${contactParts ? `<div class="contact-line">${contactParts}</div>` : ""}
    </div>
    ${gridHtml}
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
