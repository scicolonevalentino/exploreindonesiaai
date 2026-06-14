// Client-side itinerary document extraction (Excel + Word).
//
// Runs ENTIRELY in the browser: the uploaded file is parsed to text in memory
// and the bytes never leave the device, never reach our server, and are never
// stored. Only the extracted TEXT flows into the normal /p1 build flow (it
// lands in the editable textarea so the user sees exactly what the model will).
//
// Heavy parsers (xlsx, mammoth) live here so the page can lazy-load this whole
// module on first upload — it adds nothing to the initial /p1 bundle.
//
// Design choice: faithful extraction, NOT semantic parsing. We turn the file
// into clean Markdown and let the generation model interpret which column is
// the day, etc. Our job is to lose as little structure as possible.

import * as XLSX from "xlsx";
import mammoth from "mammoth/mammoth.browser";

export class DocumentExtractError extends Error {}

export type ExtractResult = {
  text: string;
  kind: "excel" | "word" | "pdf";
  filename: string;
  truncated: boolean;
};

// Limits. The file cap rejects before parsing; the text cap protects the token
// budget of the generation call. Excel can explode in cell count, so we also
// bound rows per sheet.
export const MAX_FILE_BYTES = 2 * 1024 * 1024; // 2 MB
const MAX_TEXT_CHARS = 25_000; // ~6-8k tokens
const MAX_ROWS_PER_SHEET = 400;
const MAX_PDF_PAGES = 50;

function extOf(name: string): string {
  const i = name.lastIndexOf(".");
  return i === -1 ? "" : name.slice(i + 1).toLowerCase();
}

// Public entry. Validates, dispatches by type, caps the result.
export async function extractDocument(file: File): Promise<ExtractResult> {
  if (file.size > MAX_FILE_BYTES) {
    throw new DocumentExtractError(
      "That file is over 2 MB. Please upload a smaller itinerary, or paste the text instead.",
    );
  }

  const ext = extOf(file.name);
  if (ext === "doc") {
    throw new DocumentExtractError(
      "Old .doc files aren't supported. Please re-save as .docx and upload again.",
    );
  }

  const isExcel = ext === "xlsx" || ext === "xls" || ext === "xlsm";
  const isWord = ext === "docx";
  const isPdf = ext === "pdf";
  if (!isExcel && !isWord && !isPdf) {
    throw new DocumentExtractError(
      "Unsupported file. Upload a Word (.docx), Excel (.xlsx), or PDF itinerary, or paste the text.",
    );
  }

  let buffer: ArrayBuffer;
  try {
    buffer = await file.arrayBuffer();
  } catch {
    throw new DocumentExtractError("Couldn't read that file. Please try again.");
  }

  const kind: "excel" | "word" | "pdf" = isExcel ? "excel" : isPdf ? "pdf" : "word";
  let raw: string;
  try {
    raw = isExcel
      ? extractExcel(buffer, file.name)
      : isPdf
        ? await extractPdf(buffer, file.name)
        : await extractWord(buffer, file.name);
  } catch (err) {
    if (err instanceof DocumentExtractError) throw err;
    throw new DocumentExtractError(
      "Couldn't read that file. It may be corrupted or password-protected. Try pasting the text instead.",
    );
  }

  const cleaned = raw.trim();
  if (cleaned.length < 20) {
    throw new DocumentExtractError(
      "We couldn't find any itinerary text in that file. Try pasting it instead.",
    );
  }

  let text = cleaned;
  let truncated = false;
  if (text.length > MAX_TEXT_CHARS) {
    text = text.slice(0, MAX_TEXT_CHARS);
    truncated = true;
  }

  return { text, kind, filename: file.name, truncated };
}

/* ---------------------------------- Excel --------------------------------- */

function extractExcel(buffer: ArrayBuffer, filename: string): string {
  // cellDates:false + raw:false later => we render the FORMATTED display string
  // (`w`), so dates read "12 Jun 2026" not the serial 46184, and currency keeps
  // its formatting. Formulas come back as their cached computed value.
  const wb = XLSX.read(buffer, { type: "array", cellText: true });

  const sections: string[] = [`[Uploaded spreadsheet: ${filename}]`];

  for (const name of wb.SheetNames) {
    const ws = wb.Sheets[name];
    if (!ws || !ws["!ref"]) continue;

    fillMergedCells(ws);

    const rows = XLSX.utils.sheet_to_json<string[]>(ws, {
      header: 1,
      raw: false, // use formatted display text
      defval: "",
      blankrows: false,
    });

    const trimmed = trimGrid(rows.map((r) => r.map((c) => String(c ?? ""))));
    if (trimmed.length === 0) continue; // empty sheet, skip

    let sheetRows = trimmed;
    let noteTruncated = false;
    if (sheetRows.length > MAX_ROWS_PER_SHEET) {
      sheetRows = sheetRows.slice(0, MAX_ROWS_PER_SHEET);
      noteTruncated = true;
    }

    const block = [`Sheet: "${name}"`, toMarkdownTable(sheetRows)];
    if (noteTruncated) block.push(`(sheet truncated at ${MAX_ROWS_PER_SHEET} rows)`);
    sections.push(block.join("\n"));
  }

  // Only the header line means nothing usable was found.
  if (sections.length === 1) {
    throw new DocumentExtractError(
      "That spreadsheet looks empty. Try pasting your itinerary instead.",
    );
  }

  return sections.join("\n\n");
}

// Forward-fill merged ranges: by default Excel stores a merged value only in the
// top-left cell, leaving the rest blank. For an itinerary where "Day 1" is
// merged down across several activity rows, that orphans every activity from its
// day. We copy the anchor value into every spanned cell so each row stands alone.
function fillMergedCells(ws: XLSX.WorkSheet): void {
  const merges = ws["!merges"];
  if (!merges) return;
  for (const m of merges) {
    const anchor = ws[XLSX.utils.encode_cell({ r: m.s.r, c: m.s.c })] as
      | XLSX.CellObject
      | undefined;
    if (!anchor) continue;
    for (let r = m.s.r; r <= m.e.r; r++) {
      for (let c = m.s.c; c <= m.e.c; c++) {
        if (r === m.s.r && c === m.s.c) continue;
        ws[XLSX.utils.encode_cell({ r, c })] = { t: anchor.t, v: anchor.v, w: anchor.w };
      }
    }
  }
}

// Drop trailing empty columns and any leading/trailing fully-empty rows so we
// don't feed the model a grid full of spacer cells.
function trimGrid(rows: string[][]): string[][] {
  const nonEmpty = (s: string) => s.trim().length > 0;

  let maxCol = -1;
  for (const row of rows) {
    for (let c = row.length - 1; c >= 0; c--) {
      if (nonEmpty(row[c])) {
        if (c > maxCol) maxCol = c;
        break;
      }
    }
  }
  if (maxCol === -1) return [];

  const clipped = rows.map((r) => {
    const out = r.slice(0, maxCol + 1);
    while (out.length < maxCol + 1) out.push("");
    return out;
  });

  let start = 0;
  let end = clipped.length;
  while (start < end && !clipped[start].some(nonEmpty)) start++;
  while (end > start && !clipped[end - 1].some(nonEmpty)) end--;
  return clipped.slice(start, end);
}

function escapeCell(s: string): string {
  return s.replace(/\r?\n/g, " ").replace(/\|/g, "\\|").trim();
}

// Render a grid as a GitHub-style Markdown table (first row = header). The model
// reads columnar structure far better from this than from flattened CSV.
function toMarkdownTable(rows: string[][]): string {
  if (rows.length === 0) return "";
  const width = rows[0].length;
  const header = rows[0].map(escapeCell);
  const sep = Array(width).fill("---");
  const body = rows.slice(1).map((r) => {
    const cells = r.map(escapeCell);
    while (cells.length < width) cells.push("");
    return `| ${cells.slice(0, width).join(" | ")} |`;
  });
  return [`| ${header.join(" | ")} |`, `| ${sep.join(" | ")} |`, ...body].join("\n");
}

/* ------------------------------------ PDF --------------------------------- */

// Extract the text layer from a PDF, page by page, with pdf.js. Runs in the
// browser (the worker too), so the file never leaves the device. Scanned/photo
// PDFs have no text layer: we detect the empty result and tell the user to
// paste instead, rather than silently returning nothing.
async function extractPdf(buffer: ArrayBuffer, filename: string): Promise<string> {
  // Loaded only when a PDF is actually uploaded, so non-PDF uploads never pay
  // for pdf.js. The worker is served as a URL via Vite's `?url` suffix.
  const pdfjs = await import("pdfjs-dist");
  const workerUrl = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

  const doc = await pdfjs.getDocument({ data: new Uint8Array(buffer) }).promise;
  const pageCount = Math.min(doc.numPages, MAX_PDF_PAGES);

  const pages: string[] = [];
  for (let p = 1; p <= pageCount; p++) {
    const page = await doc.getPage(p);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((it) => ("str" in it ? it.str : ""))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    if (pageText) pages.push(pageText);
  }

  const text = pages.join("\n\n").trim();
  if (text.length < 20) {
    throw new DocumentExtractError(
      "We couldn't read any text from that PDF. If it's a scan or photo, please paste the itinerary text instead.",
    );
  }

  const header = `[Uploaded PDF: ${filename}]`;
  const note =
    doc.numPages > MAX_PDF_PAGES ? `\n(only the first ${MAX_PDF_PAGES} pages were read)` : "";
  return `${header}${note}\n\n${text}`;
}

/* ----------------------------------- Word --------------------------------- */

async function extractWord(buffer: ArrayBuffer, filename: string): Promise<string> {
  // convertToHtml (not raw text) so headings, lists, and TABLES survive — many
  // Word itineraries lay days out in tables that raw text would flatten.
  const { value: html } = await mammoth.convertToHtml({ arrayBuffer: buffer });
  const md = htmlToMarkdown(html);
  return `[Uploaded document: ${filename}]\n\n${md}`;
}

// Minimal HTML -> Markdown for the limited tag set mammoth emits. Uses the
// browser's DOMParser (this module only ever runs client-side). Exported for
// testing the conversion against canonical mammoth HTML output.
export function htmlToMarkdown(html: string): string {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const out: string[] = [];

  const inline = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent ?? "";
    if (node.nodeType !== Node.ELEMENT_NODE) return "";
    const el = node as HTMLElement;
    const inner = Array.from(el.childNodes).map(inline).join("");
    switch (el.tagName) {
      case "STRONG":
      case "B":
        return `**${inner}**`;
      case "EM":
      case "I":
        return `*${inner}*`;
      case "BR":
        return " ";
      case "A":
        return inner;
      default:
        return inner;
    }
  };

  const tableToMd = (table: HTMLTableElement): string => {
    const rows = Array.from(table.querySelectorAll("tr")).map((tr) =>
      Array.from(tr.querySelectorAll("th,td")).map((cell) => escapeCell(inline(cell))),
    );
    return toMarkdownTable(rows);
  };

  const walk = (node: Node) => {
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const el = node as HTMLElement;
    switch (el.tagName) {
      case "H1":
      case "H2":
      case "H3":
      case "H4":
      case "H5":
      case "H6": {
        const level = Number(el.tagName[1]);
        out.push(`${"#".repeat(level)} ${inline(el).trim()}`);
        return;
      }
      case "P": {
        const t = inline(el).trim();
        if (t) out.push(t);
        return;
      }
      case "UL":
      case "OL": {
        const items = Array.from(el.querySelectorAll(":scope > li")).map(
          (li) => `- ${inline(li).trim()}`,
        );
        if (items.length) out.push(items.join("\n"));
        return;
      }
      case "TABLE":
        out.push(tableToMd(el as HTMLTableElement));
        return;
      default:
        Array.from(el.childNodes).forEach(walk);
    }
  };

  Array.from(doc.body.childNodes).forEach(walk);
  return out.filter(Boolean).join("\n\n");
}
