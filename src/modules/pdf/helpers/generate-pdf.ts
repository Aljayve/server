export async function generatePdf(html: string): Promise<Buffer> {
    let puppeteer: any;
    try {
        puppeteer = await import("puppeteer");
    } catch {
        throw new Error(
            "PDF generation is not available in this environment (puppeteer/Chromium unsupported).",
        );
    }

    const { mkdtempSync, rmSync } = await import("fs");
    const { tmpdir } = await import("os");
    const { join } = await import("path");

    const userDataDir = mkdtempSync(join(tmpdir(), "puppeteer-"));

    let browser: any;
    try {
        browser = await puppeteer.launch({
            headless: true,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-gpu",
            ],
            userDataDir,
        });
    } catch (e: any) {
        try { rmSync(userDataDir, { recursive: true, force: true }); } catch { }
        throw new Error(
            "PDF generation unavailable: " + (e?.message ?? "unknown error"),
        );
    }

    try {
        const page = await browser.newPage();

        await page.setViewport({
            width: 794,
            height: 1123,
            deviceScaleFactor: 1,
        });

        await page.setContent(html, {
            waitUntil: "networkidle0" as any,
        });

        const pdf = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: {
                top: "0.4in",
                right: "0.4in",
                bottom: "0.4in",
                left: "0.4in",
            },
        });

        return Buffer.from(pdf);
    } finally {
        await browser.close();
        try { rmSync(userDataDir, { recursive: true, force: true }); } catch { }
    }
}
