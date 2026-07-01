export function renderEducation(education: any[] = []): string {
    if (!education?.length) return "";

    const items = education.map((edu) => {
        const school = edu.school || "";
        const degreeField = [edu.degree, edu.fieldOfStudy].filter(Boolean).join(" - ");
        const hasDate = edu.startDate || edu.endDate;

        return `
        <div class="item">
            <div class="item-header">
                ${school ? `<strong class="item-title">${school}</strong>` : ""}
                ${hasDate ? `<span class="date">${edu.startDate || ""} - ${edu.endDate || "Present"}</span>` : ""}
            </div>
            ${degreeField ? `<div class="item-sub">${degreeField}</div>` : ""}
        </div>`;
    }).join("");

    return `
    <section class="section">
        <h2>Education</h2>
        ${items}
    </section>`;
}
