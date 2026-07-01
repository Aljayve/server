export function renderSkills(skills: string[] = []): string {
    const filtered = (skills ?? []).filter(Boolean);
    if (!filtered.length) return "";

    return `
    <section class="section">
        <h2>Skills</h2>
        <div class="skills">
            ${filtered.map((s) => `<span class="skill">${s}</span>`).join("")}
        </div>
    </section>`;
}

export function renderSkillBars(skills: string[] = []): string {
    const filtered = (skills ?? []).filter(Boolean);
    if (!filtered.length) return "";

    return `
    <section class="section">
        <h2>Skills</h2>
        ${filtered.map((s) => `
        <div class="skill-bar">
            <span>${s}</span>
            <div class="bar"><div class="bar-fill" style="width:75%"></div></div>
        </div>`).join("")}
    </section>`;
}
