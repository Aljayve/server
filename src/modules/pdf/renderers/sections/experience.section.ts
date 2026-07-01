export function renderExperience(experience: any[] = []): string {
    if (!experience?.length) return "";

    const items = experience.map((job) => {
        const title = job.position || job.company || "";
        const hasDate = job.startDate || job.endDate;
        const endLabel = job.endDate || "Present";

        const subLine = job.company && job.position ? job.company : "";

        return `
        <div class="item">
            <div class="item-header">
                ${title ? `<strong class="item-title">${title}</strong>` : ""}
                ${hasDate ? `<span class="date">${job.startDate || ""}${job.startDate || job.endDate ? " - " + endLabel : ""}</span>` : ""}
            </div>
            ${subLine ? `<div class="item-sub">${subLine}</div>` : ""}
            ${job.description ? `<p>${job.description}</p>` : ""}
        </div>`;
    }).join("");

    return `
    <section class="section">
        <h2>Experience</h2>
        ${items}
    </section>`;
}
