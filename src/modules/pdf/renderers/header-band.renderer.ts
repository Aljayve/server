import { ResumeRenderer } from "./renderer.interface";
import { baseStyle, headerBandStyle } from "../styles";
import { renderPersonalInfo, renderSummary, renderExperience, renderEducation, renderSkills, renderProjects, renderCertifications, renderLanguages } from "./sections";

export class HeaderBandRenderer implements ResumeRenderer {
    render(resume: any): string {
        const p = resume.personalInfo ?? {};
        const name = [p.firstName, p.lastName].filter(Boolean).join(" ");

        const col1Content = [
            renderSummary(resume.personalInfo?.summary),
            renderExperience(resume.experience),
            renderProjects(resume.projects),
        ].filter(s => s.trim()).join("");

        const asideContent = [
            renderSkills(resume.skills),
            renderEducation(resume.education),
            renderCertifications(resume.certifications),
            renderLanguages(resume.languages),
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
<head><meta charset="UTF-8"><style>${baseStyle}${headerBandStyle}</style></head>
<body>
    <div class="strip">
        ${p.photo
            ? `<img class="avatar" src="${p.photo}" alt="photo"/>`
            : name ? `<div class="avatar-placeholder">${name.charAt(0)}</div>` : ""}
        <div class="strip-text">
            ${renderPersonalInfo(resume.personalInfo ?? {})}
        </div>
    </div>
    ${gridHtml}
</body>
</html>`;
    }
}
