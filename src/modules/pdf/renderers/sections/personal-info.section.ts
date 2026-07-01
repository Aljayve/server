export interface PersonalInfo {
    firstName?: string;
    lastName?: string;
    label?: string;
    email?: string;
    phone?: string;
    city?: string;
    url?: string;
    summary?: string;
    photo?: string;
}

export function renderPersonalInfo(p: PersonalInfo): string {
    const name = [p.firstName, p.lastName].filter(Boolean).join(" ");
    const hasAny = name || p.label || p.email || p.phone || p.city || p.url;
    if (!hasAny) return "";

    const contactParts = [p.email, p.phone, p.city, p.url].filter(Boolean);

    return `
    <div class="personal-header">
        ${name ? `<h1>${name}</h1>` : ""}
        ${p.label ? `<div class="label">${p.label}</div>` : ""}
        ${contactParts.length ? `<div class="contact">${contactParts.join(" | ")}</div>` : ""}
    </div>`;
}

export function renderSummary(summary?: string): string {
    if (!summary?.trim()) return "";
    return `
    <section class="section">
        <h2>Profile</h2>
        <p>${summary}</p>
    </section>`;
}
