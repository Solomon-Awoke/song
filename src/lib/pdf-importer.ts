import { PDFParse } from 'pdf-parse';

export interface ParsedSong {
  titleAm: string;
  lyricsAm: string;
}

export interface ImportResult {
  songs: ParsedSong[];
  errors: { index: number; message: string }[];
}

/**
 * Extract text from a PDF buffer using pdf-parse.
 */
export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  const parser = new PDFParse({ data: buffer });
  try {
    const result = await parser.getText();
    return result.text;
  } finally {
    await parser.destroy();
  }
}

/**
 * Heuristic: detect if a line looks like a song title.
 * Titles are typically short (~80 chars max), not empty, not purely numeric,
 * and often in a distinct case or separated by whitespace.
 */
function looksLikeTitle(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed) return false;
  if (trimmed.length > 120) return false;
  // Skip lines that are just numbers, page numbers, or separators
  if (/^[\d\s\-_•·/\\|]+$/.test(trimmed)) return false;
  // Skip very short fragments
  if (trimmed.length < 3) return false;
  return true;
}

/**
 * Split extracted PDF text into individual songs.
 *
 * Strategy:
 * 1. Split on double-newlines (paragraph boundaries).
 * 2. Merge small fragments that are likely continuation of a title.
 * 3. In each block, treat the first "title-like" line as the title
 *    and the rest as lyrics.
 */
function splitIntoSongs(rawText: string): ParsedSong[] {
  // Normalize line endings
  const text = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Split on blank lines (two or more newlines with optional whitespace)
  const blocks = text.split(/\n\s*\n+/).filter((b) => b.trim().length > 0);

  const songs: ParsedSong[] = [];

  for (const block of blocks) {
    const lines = block.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);

    if (lines.length === 0) continue;

    // Find the first line that looks like a title
    let titleIdx = -1;
    for (let i = 0; i < lines.length; i++) {
      if (looksLikeTitle(lines[i])) {
        titleIdx = i;
        break;
      }
    }

    if (titleIdx === -1) {
      // No clear title found — use first non-empty line as title
      titleIdx = 0;
    }

    const titleAm = lines[titleIdx];
    const lyricsAm = lines.slice(titleIdx + 1).join('\n').trim();

    if (!lyricsAm) continue; // skip blocks without lyrics

    songs.push({ titleAm, lyricsAm });
  }

  return songs;
}

/**
 * Parse a PDF buffer and extract songs.
 * Handles errors gracefully per-song.
 */
export async function parsePdfToSongs(buffer: Buffer): Promise<ImportResult> {
  try {
    const rawText = await extractTextFromPdf(buffer);
    const songs = splitIntoSongs(rawText);
    return { songs, errors: [] };
  } catch (error) {
    return {
      songs: [],
      errors: [{ index: 0, message: error instanceof Error ? error.message : 'Unknown PDF parse error' }],
    };
  }
}
