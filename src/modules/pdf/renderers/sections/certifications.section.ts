export function renderCertifications(certifications: any[] = []): string {
    if (!certifications?.length) return "";

    const items = certifications.map((cert) => {
        const name = cert.name || "";
        const issueLine = cert.issuer
            ? `${cert.issuer}${cert.issueDate ? " - " + cert.issueDate : ""}`
            : cert.issueDate || "";

        return `
        <div class="item">
            ${name ? `<div class="item-header"><strong class="item-title">${name}</strong></div>` : ""}
            ${issueLine ? `<div class="item-sub">${issueLine}</div>` : ""}
        </div>`;
    }).join("");

    return `
    <section class="section">
        <h2>Certifications</h2>
        ${items}
    </section>`;
}
