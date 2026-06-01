type ErrorDetails = {
  name?: string;
  message?: string;
  stack?: string;
  fileName?: string;
  lineNumber?: number | string;
  columnNumber?: number | string;
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function extractErrorDetails(error: unknown): ErrorDetails {
  if (!error) return {};
  if (error instanceof Error) {
    const anyErr = error as Error & {
      fileName?: string;
      lineNumber?: number;
      columnNumber?: number;
    };
    // Parse first useful stack frame for file/line/col when not present.
    let fileName = anyErr.fileName;
    let lineNumber: number | string | undefined = anyErr.lineNumber;
    let columnNumber: number | string | undefined = anyErr.columnNumber;
    if (!fileName && typeof error.stack === "string") {
      const match = error.stack.match(/\(?([^()\s]+):(\d+):(\d+)\)?/);
      if (match) {
        fileName = match[1];
        lineNumber = match[2];
        columnNumber = match[3];
      }
    }
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      fileName,
      lineNumber,
      columnNumber,
    };
  }
  if (typeof error === "object") {
    try {
      return { message: JSON.stringify(error) };
    } catch {
      return { message: String(error) };
    }
  }
  return { message: String(error) };
}

/**
 * Log a structured, easy-to-grep diagnostic for SSR/server failures.
 * Always emits the raw Error too so the runtime preserves the native stack.
 */
export function logServerError(context: string, error: unknown): void {
  const details = extractErrorDetails(error);
  const location =
    details.fileName != null
      ? `${details.fileName}${details.lineNumber != null ? `:${details.lineNumber}` : ""}${
          details.columnNumber != null ? `:${details.columnNumber}` : ""
        }`
      : "unknown location";
  // Structured single-line summary that survives log aggregators.
  console.error(
    `[ssr-error] ${context} | ${details.name ?? "Error"}: ${
      details.message ?? "(no message)"
    } @ ${location}`,
  );
  // Raw error preserves stack formatting in Worker / Node logs.
  console.error(error);
}

export function renderErrorPage(error?: unknown): string {
  const isDev = (() => {
    try {
      return (
        typeof process !== "undefined" &&
        (process.env?.NODE_ENV === "development" || process.env?.DEV === "true")
      );
    } catch {
      return false;
    }
  })();

  let detailsBlock = "";
  if (error && isDev) {
    const d = extractErrorDetails(error);
    const loc = d.fileName
      ? `${d.fileName}${d.lineNumber ? `:${d.lineNumber}` : ""}${
          d.columnNumber ? `:${d.columnNumber}` : ""
        }`
      : "";
    detailsBlock = `
      <details open class="diag">
        <summary>Error details (dev only)</summary>
        <p class="meta"><strong>${escapeHtml(d.name ?? "Error")}:</strong> ${escapeHtml(d.message ?? "")}</p>
        ${loc ? `<p class="meta"><strong>Location:</strong> ${escapeHtml(loc)}</p>` : ""}
        ${d.stack ? `<pre>${escapeHtml(d.stack)}</pre>` : ""}
      </details>`;
  }

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>This page didn't load</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: #fafafa; color: #111; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 48rem; width: 100%; text-align: center; padding: 2rem; }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; }
      p { color: #4b5563; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.5rem 1rem; border-radius: 0.375rem; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: #111; color: #fff; }
      .secondary { background: #fff; color: #111; border-color: #d1d5db; }
      .diag { margin-top: 1.5rem; text-align: left; background: #fff; border: 1px solid #e5e7eb; border-radius: 0.5rem; padding: 1rem; }
      .diag summary { cursor: pointer; font-weight: 600; }
      .diag .meta { margin: 0.5rem 0; color: #111; }
      .diag pre { background: #f3f4f6; padding: 0.75rem; border-radius: 0.375rem; overflow: auto; font: 12px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace; white-space: pre-wrap; word-break: break-word; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>This page didn't load</h1>
      <p>Something went wrong on our end. You can try refreshing or head back home.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Try again</button>
        <a class="secondary" href="/">Go home</a>
      </div>
      ${detailsBlock}
    </div>
  </body>
</html>`;
}
