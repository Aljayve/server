export function renderLanguages(languages: any[] = []): string {
    if (!languages?.length) return "";

    const items = languages.map((lang) => {
        const name = lang.name || "";
        if (!name) return "";
        return `
        <div class="item">
            <span>${name}</span>
            ${lang.proficiency ? `<span class="muted"> - ${lang.proficiency}</span>` : ""}
        </div>`;
    }).filter(Boolean).join("");

    if (!items) return "";

    return `
    <section class="section">
        <h2>Languages</h2>
        ${items}
    </section>`;
}
