/**
 * Client-side PDF export for song lyrics.
 * Uses jspdf + html2canvas to generate a styled PDF with Ethiopian cross motif.
 */

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export interface SongPdfData {
  titleAm: string;
  titleEn?: string;
  lyricsAm: string;
  lyricsEn?: string;
}

const CROSS = "✠";
const CHURCH_NAME = "የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያን";
const CHURCH_NAME_EN = "Ethiopian Orthodox Tewahedo Church";

/**
 * Generate a PDF Blob for a song's lyrics.
 * Creates a styled document with title, cross motif, lyrics, and church footer.
 */
export async function generateSongPdf(song: SongPdfData): Promise<Blob> {
  // Build the HTML content for html2canvas rendering
  const html = buildPdfHtml(song);

  // Create a temporary container off-screen
  const container = document.createElement("div");
  container.innerHTML = html;
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.style.width = "800px";
  document.body.appendChild(container);

  try {
    // Render to canvas
    const canvas = await html2canvas(container, {
      scale: 2, // Retina quality
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const pdf = new jsPDF("p", "mm", "a4");
    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if content overflows
    while (heightLeft > 0) {
      position = heightLeft - imgHeight; // negative offset
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    return pdf.output("blob");
  } finally {
    // Clean up the temporary container
    document.body.removeChild(container);
  }
}

/**
 * Build the styled HTML string for the PDF content.
 */
function buildPdfHtml(song: SongPdfData): string {
  const { titleAm, titleEn, lyricsAm, lyricsEn } = song;

  const amLines = lyricsAm
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const enLines = lyricsEn
    ? lyricsEn
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
      : [];

  // Build lyrics HTML for a language column
  function renderLyrics(lines: string[], lang: "am" | "en"): string {
    return lines
      .map((line) => {
        const isStanzaLabel = line.startsWith("[") && line.endsWith("]");
        if (isStanzaLabel) {
          const label = line.slice(1, -1);
          return `<p style="font-size:12px;font-weight:600;color:#8B6914;margin-top:12px;margin-bottom:4px;${lang === "am" ? "font-family:sans-serif" : "font-style:italic"}">${escapeHtml(label)}</p>`;
        }
        return `<p style="font-size:11px;line-height:1.8;margin:2px 0;${lang === "am" ? "font-family:sans-serif" : "font-family:serif;font-style:italic"}">${escapeHtml(line)}</p>`;
      })
      .join("");
  }

  const hasEnglish = enLines.length > 0;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body {
      width: 800px;
      margin: 0;
      padding: 40px;
      font-family: sans-serif;
      color: #1a1a1a;
      background: #ffffff;
    }
    .cross {
      text-align: center;
      font-size: 28px;
      color: #8B6914;
      margin-bottom: 16px;
    }
    .title-am {
      text-align: center;
      font-size: 20px;
      font-weight: 700;
      color: #8B6914;
      margin-bottom: 4px;
    }
    .title-en {
      text-align: center;
      font-size: 14px;
      font-style: italic;
      color: #666;
      margin-bottom: 8px;
    }
    .divider {
      width: 120px;
      height: 1px;
      background: linear-gradient(to right, transparent, #8B6914, transparent);
      margin: 16px auto;
    }
    .lyrics-wrapper {
      display: flex;
      gap: 32px;
      margin-top: 16px;
    }
    .lyrics-col {
      flex: 1;
    }
    .lyrics-col:first-child {
      border-right: 1px solid #ddd;
      padding-right: 24px;
    }
    .lyrics-col:last-child {
      padding-left: 8px;
    }
    .footer {
      text-align: center;
      font-size: 10px;
      color: #999;
      margin-top: 32px;
      padding-top: 16px;
      border-top: 1px solid #eee;
    }
    .footer-cross {
      font-size: 16px;
      color: #8B6914;
    }
  </style>
</head>
<body>
  <div class="cross">${CROSS}</div>
  <div class="title-am">${escapeHtml(titleAm)}</div>
  ${titleEn ? `<div class="title-en">${escapeHtml(titleEn)}</div>` : ""}
  <div class="divider"></div>
  <div class="lyrics-wrapper">
    <div class="lyrics-col" lang="am">
      ${renderLyrics(amLines, "am")}
    </div>
    ${
      hasEnglish
        ? `<div class="lyrics-col" lang="en">
            ${renderLyrics(enLines, "en")}
          </div>`
        : `<div class="lyrics-col" style="display:flex;align-items:center;justify-content:center;color:#999;font-style:italic;font-size:13px">
            ${CROSS}<br/>English translation coming soon
          </div>`
    }
  </div>
  <div class="footer">
    <div class="footer-cross">${CROSS}</div>
    ${escapeHtml(CHURCH_NAME)}<br/>
    ${escapeHtml(CHURCH_NAME_EN)}
  </div>
</body>
</html>`;
}

/** Simple HTML escaping to prevent injection from user content. */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
