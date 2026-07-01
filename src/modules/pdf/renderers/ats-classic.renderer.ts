import { ResumeRenderer } from "./renderer.interface";
import { renderPersonalInfo, renderSummary, renderExperience, renderEducation, renderSkills, renderProjects, renderCertifications, renderLanguages } from "./sections";

export class ATSClassicRenderer implements ResumeRenderer {
    render(resume: any): string {
        const densityClass = this.getDensityClass(resume);

        return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        @page{size:A4;margin:.4in}
        *{box-sizing:border-box}
        html,body{margin:0;padding:0}
        body{font-family:Arial,Helvetica,sans-serif;color:#222;font-size:11.5px;line-height:1.45;overflow-wrap:anywhere;word-break:normal}
        a{color:inherit;text-decoration:none;overflow-wrap:anywhere}
        .resume{width:100%;max-width:100%;margin:0 auto}
        .resume-header{border-bottom:2px solid #2c3e50;padding-bottom:10px;margin-bottom:10px}
        .resume-content{display:flex;flex-direction:column;gap:8px}
        .personal-header{text-align:center}
        .personal-header h1{font-size:25px;line-height:1.15;font-weight:700;color:#1a1a1a;margin:0;letter-spacing:0;overflow-wrap:break-word}
        .personal-header .label{font-size:12px;color:#555;text-transform:uppercase;letter-spacing:.06em;margin-top:3px}
        .personal-header .contact{font-size:10.5px;color:#555;margin-top:6px;display:flex;justify-content:center;gap:4px 12px;flex-wrap:wrap;line-height:1.35}
        .section{break-inside:auto;page-break-inside:auto}
        .section h2{font-size:12.5px;line-height:1.25;font-weight:700;color:#2c3e50;text-transform:uppercase;letter-spacing:.035em;border-bottom:1.5px solid #94a3b8;padding-bottom:2px;margin:0 0 6px}
        .item{margin-bottom:6px;break-inside:avoid;page-break-inside:avoid}
        .item:last-child{margin-bottom:0}
        .item-header{display:flex;align-items:baseline;justify-content:space-between;gap:4px 10px;flex-wrap:wrap;font-weight:700;font-size:12px;line-height:1.3;color:#1a1a1a;margin-bottom:1px}
        .item-title{min-width:0;max-width:100%;overflow-wrap:anywhere}
        .item-sub{font-size:11px;color:#2c3e50;font-weight:600;line-height:1.35;margin-bottom:1px;overflow-wrap:anywhere}
        .date{margin-left:auto;color:#555;font-weight:400;font-size:10.5px;line-height:1.3;white-space:normal;text-align:right}
        .section p{font-size:11px;color:#333;margin:2px 0 0;line-height:1.45;white-space:pre-line;overflow-wrap:anywhere}
        .skills{display:flex;flex-wrap:wrap;gap:4px 5px;margin-top:4px}
        .skill{font-size:10.5px;padding:2px 6px;border:1px solid #d1d5db;border-radius:3px;color:#333;line-height:1.35;max-width:100%;overflow-wrap:anywhere}
        .muted{color:#555}
        .density-comfortable .resume-content{gap:9px}
        .density-dense{font-size:11px;line-height:1.4}
        .density-dense .resume-content{gap:7px}
        .density-dense .item{margin-bottom:5px}
        .density-dense .personal-header h1{font-size:23px}
        .density-very-dense{font-size:10.5px;line-height:1.36}
        .density-very-dense .resume-content{gap:6px}
        .density-very-dense .resume-header{padding-bottom:8px;margin-bottom:8px}
        .density-very-dense .item{margin-bottom:4px}
        .density-very-dense .section h2{font-size:12px;margin-bottom:5px}
        .density-very-dense .section p{font-size:10.5px;line-height:1.38}
        .density-very-dense .item-header{font-size:11.3px}
        .density-very-dense .item-sub{font-size:10.7px}
        .density-very-dense .skill,.density-very-dense .date{font-size:10px}
    </style>
</head>
<body class="${densityClass}">
    <main class="resume">
        <div class="resume-header">
            ${renderPersonalInfo(resume.personalInfo ?? {})}
        </div>

        <div class="resume-content">
            ${renderSummary(resume.personalInfo?.summary)}
            ${renderExperience(resume.experience)}
            ${renderEducation(resume.education)}
            ${renderSkills(resume.skills)}
            ${renderCertifications(resume.certifications)}
            ${renderProjects(resume.projects)}
            ${renderLanguages(resume.languages)}
        </div>
    </main>
</body>
</html>`;
    }

    private getDensityClass(resume: any): string {
        const count = (items: any[] = []) => Array.isArray(items) ? items.filter(Boolean).length : 0;
        const textSize = JSON.stringify(resume ?? {}).length;
        const itemCount =
            count(resume?.experience) +
            count(resume?.education) +
            count(resume?.skills) +
            count(resume?.certifications) +
            count(resume?.projects) +
            count(resume?.languages);

        if (itemCount >= 28 || textSize >= 9000) return "density-very-dense";
        if (itemCount >= 18 || textSize >= 6000) return "density-dense";
        return "density-comfortable";
    }
}
