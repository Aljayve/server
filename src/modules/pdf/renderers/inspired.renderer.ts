import { ResumeRenderer } from "./renderer.interface";
import { baseStyle, inspiredStyle } from "../styles";
import { renderPersonalInfo, renderSummary, renderExperience, renderEducation, renderSkills, renderProjects, renderCertifications, renderLanguages } from "./sections";

export class InspiredRenderer implements ResumeRenderer {
    render(resume: any): string {
        const p = resume.personalInfo ?? {};
        const name = [p.firstName, p.lastName].filter(Boolean).join(" ");

        const col1Content = [
            renderExperience(resume.experience),
            renderEducation(resume.education),
            renderCertifications(resume.certifications),
            renderProjects(resume.projects),
        ].filter(s => s.trim()).join("");

        const col2Content = [
            renderSummary(resume.personalInfo?.summary),
            renderSkills(resume.skills),
            renderLanguages(resume.languages),
        ].filter(s => s.trim()).join("");

        const hasCol1 = !!col1Content.trim();
        const hasCol2 = !!col2Content.trim();

        const gridHtml = (hasCol1 && hasCol2)
            ? `<div class="grid">
        <div>${col1Content}</div>
        <aside class="sidebar-bg">${col2Content}</aside>
    </div>`
            : `<div>${col1Content}${col2Content}</div>`;

        return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><style>${baseStyle}${inspiredStyle}</style></head>
<body>
    <div class="deco-circle"></div>

    <div class="hero">
        ${p.photo
            ? `<img class="avatar" src="${p.photo}" alt="photo"/>`
            : name ? `<div class="avatar-placeholder">${name.charAt(0)}</div>` : ""}
        ${renderPersonalInfo(resume.personalInfo ?? {})}
    </div>

    ${gridHtml}
</body>
</html>`;
    }
}
