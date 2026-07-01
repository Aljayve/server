interface CoverLetterData {
    content: string;
    jobTitle: string;
    companyName: string;
}

export class CoverLetterPdfRenderer {
    render(data: CoverLetterData): string {
        const paragraphs = data.content
            .split("\n")
            .map(line => line.trim())
            .filter(line => line.length > 0);

        return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        @page { size: A4; margin: 1in }
        * { box-sizing: border-box }
        html, body { margin: 0; padding: 0 }
        body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 12pt;
            line-height: 1.6;
            color: #222;
        }
        .letter {
            max-width: 6.5in;
            margin: 0 auto;
        }
        p {
            margin: 0 0 1em;
            text-align: justify;
        }
        .date {
            margin-bottom: 1.5em;
        }
        .salutation {
            margin-bottom: 1em;
        }
        .closing {
            margin-top: 1.5em;
        }
        .signature {
            margin-top: 2em;
        }
        hr {
            border: none;
            border-top: 1px solid #ccc;
            margin: 2em 0 0.5em;
        }
        .footer {
            font-size: 10pt;
            color: #666;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="letter">
        ${paragraphs.map(p => `<p>${this.escapeHtml(p)}</p>`).join("\n        ")}
    </div>
</body>
</html>`;
    }

    private escapeHtml(text: string): string {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }
}
