export function renderProjects(projects: any[] = []): string {
    if (!projects?.length) return "";

    const items = projects.map((proj) => {
        const name = proj.name || "";
        return `
        <div class="item">
            ${name ? `<div class="item-header"><strong class="item-title">${name}</strong></div>` : ""}
            ${proj.description ? `<p>${proj.description}</p>` : ""}
            ${proj.link ? `<a href="${proj.link}">${proj.link}</a>` : ""}
        </div>`;
    }).join("");

    return `
    <section class="section">
        <h2>Projects</h2>
        ${items}
    </section>`;
}
