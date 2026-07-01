import { mkdtempSync, rmSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import puppeteer from "puppeteer";

export async function generatePdf(html: string): Promise<Buffer> {
    const userDataDir = mkdtempSync(join(tmpdir(), "puppeteer-"));

    const browser = await puppeteer.launch({
        headless: true,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-gpu",
        ],
        userDataDir,
    });

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
        try { rmSync(userDataDir, { recursive: true, force: true }); } catch { /* ignore cleanup errors */ }
    }
}
