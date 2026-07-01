import { ResumeRenderer } from "./renderer.interface";
import { baseStyle, accessibleStyle } from "../styles";
import { renderPersonalInfo, renderSummary, renderExperience, renderEducation, renderSkills, renderProjects, renderCertifications, renderLanguages } from "./sections";

export class AccessibleRenderer implements ResumeRenderer {
    render(resume: any): string {
        const sections = [
            renderPersonalInfo(resume.personalInfo ?? {}),
            renderSummary(resume.personalInfo?.summary),
            renderExperience(resume.experience),
            renderEducation(resume.education),
            renderSkills(resume.skills),
            renderCertifications(resume.certifications),
            renderProjects(resume.projects),
            renderLanguages(resume.languages),
        ].filter(s => s.trim()).join("");

        return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><style>${baseStyle}${accessibleStyle}</style></head>
<body>
    ${sections}
</body>
</html>`;
    }
}
