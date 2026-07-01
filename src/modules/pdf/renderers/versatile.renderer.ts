import { ResumeRenderer } from "./renderer.interface";
import { baseStyle, versatileStyle } from "../styles";
import { renderPersonalInfo, renderSummary, renderExperience, renderEducation, renderSkills, renderProjects, renderCertifications, renderLanguages } from "./sections";

export class VersatileRenderer implements ResumeRenderer {
    render(resume: any): string {
        const p = resume.personalInfo ?? {};
        const name = [p.firstName, p.lastName].filter(Boolean).join(" ");

        const contactParts = [p.email, p.phone, p.city, p.url].filter(Boolean);

        const sections = [
            renderSummary(resume.personalInfo?.summary),
            renderExperience(resume.experience),
            renderEducation(resume.education),
            renderSkills(resume.skills),
            renderCertifications(resume.certifications),
            renderProjects(resume.projects),
            renderLanguages(resume.languages),
        ].filter(s => s.trim()).join("");

        const headerInfoHtml = renderPersonalInfo(resume.personalInfo ?? {});

        return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><style>${baseStyle}${versatileStyle}</style></head>
<body>
    <div class="header">
        <div class="header-left">
            ${p.photo ? `<img class="avatar" src="${p.photo}" alt="photo"/>` : name ? `<div class="avatar-placeholder">${name.charAt(0)}</div>` : ""}
            ${headerInfoHtml}
        </div>
        ${contactParts.length ? `<div class="header-right">
            ${contactParts.map(v => `<div>${v}</div>`).join("")}
        </div>` : ""}
    </div>

    ${sections ? `<div class="divider"></div>${sections}` : ""}
</body>
</html>`;
    }
}
