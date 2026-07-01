import { ResumeRenderer } from "./renderer.interface";
import { baseStyle, sidebarRightStyle } from "../styles";
import { renderPersonalInfo, renderSummary, renderExperience, renderEducation, renderSkills, renderProjects, renderCertifications, renderLanguages } from "./sections";

export class SidebarRightRenderer implements ResumeRenderer {
    render(resume: any): string {
        const p = resume.personalInfo ?? {};
        const name = [p.firstName, p.lastName].filter(Boolean).join(" ");

        const mainContent = [
            renderSummary(resume.personalInfo?.summary),
            renderExperience(resume.experience),
            renderProjects(resume.projects),
            renderCertifications(resume.certifications),
        ].filter(s => s.trim()).join("");

        const sidebarContent = [
            p.photo
                ? `<img class="avatar" src="${p.photo}" alt="photo"/>`
                : name ? `<div class="avatar-placeholder">${name.charAt(0)}</div>` : "",
            renderPersonalInfo(resume.personalInfo ?? {}),
            renderSkills(resume.skills),
            renderEducation(resume.education),
            renderLanguages(resume.languages),
        ].filter(s => s.trim()).join("");

        const hasMain = !!mainContent.trim();
        const hasSidebar = !!sidebarContent.trim();

        if (hasMain && hasSidebar) {
            return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><style>${baseStyle}${sidebarRightStyle}</style></head>
<body>
    <div class="grid">
        <main class="main">${mainContent}</main>
        <aside class="sidebar">${sidebarContent}</aside>
    </div>
</body>
</html>`;
        }

        return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><style>${baseStyle}${sidebarRightStyle}</style></head>
<body>
    <div>${mainContent}${sidebarContent}</div>
</body>
</html>`;
    }
}
