import { ResumeRenderer } from "./renderer.interface";
import { baseStyle, creativeStyle } from "../styles";
import { renderPersonalInfo, renderSummary, renderExperience, renderEducation, renderSkills, renderProjects, renderCertifications, renderLanguages } from "./sections";

export class CreativeRenderer implements ResumeRenderer {
    render(resume: any): string {
        const p = resume.personalInfo ?? {};
        const name = [p.firstName, p.lastName].filter(Boolean).join(" ");

        const asideContent = [
            renderSkills(resume.skills),
            renderEducation(resume.education),
            renderCertifications(resume.certifications),
            renderLanguages(resume.languages),
        ].filter(s => s.trim()).join("");

        const mainContent = [
            renderSummary(resume.personalInfo?.summary),
            renderExperience(resume.experience),
            renderProjects(resume.projects),
        ].filter(s => s.trim()).join("");

        const hasAside = !!asideContent.trim();
        const hasMain = !!mainContent.trim();

        const gridHtml = (hasAside && hasMain)
            ? `<div class="grid">
        <aside>${asideContent}</aside>
        <main class="main">${mainContent}</main>
    </div>`
            : `<div>${asideContent}${mainContent}</div>`;

        return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><style>${baseStyle}${creativeStyle}</style></head>
<body>
    <div class="hero">
        <div class="hero-circle"></div>
        <div class="hero-circle"></div>
        <div class="hero-circle"></div>
        <div class="hero-content">
            ${p.photo
                ? `<img class="avatar" src="${p.photo}" alt="photo"/>`
                : name ? `<div class="avatar-placeholder">${name.charAt(0)}</div>` : ""}
            ${renderPersonalInfo(resume.personalInfo ?? {})}
        </div>
    </div>
    ${gridHtml}
</body>
</html>`;
    }
}
