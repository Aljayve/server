import { ResumeRenderer } from "./renderer.interface";
import { baseStyle, plainStyle } from "../styles";
import { renderPersonalInfo, renderSummary, renderExperience, renderEducation, renderSkills, renderProjects, renderCertifications, renderLanguages } from "./sections";

export class PlainRenderer implements ResumeRenderer {
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
<head><meta charset="UTF-8"><style>${baseStyle}${plainStyle}</style></head>
<body>
    ${sections}
</body>
</html>`;
    }
}
