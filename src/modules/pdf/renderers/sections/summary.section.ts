export function renderSummary(summary?: string): string {
    if (!summary?.trim()) return "";

    return `
    <section class="section">
        <h2>Summary</h2>
        <p>${summary}</p>
    </section>`;
}
