const READER_TITLE = "pi reader export";

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

function escapeYamlDoubleQuoted(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

export function formatTimestampForFilename(date: Date): string {
  return [
    date.getFullYear(),
    pad2(date.getMonth() + 1),
    pad2(date.getDate()),
  ].join("-") + `-${pad2(date.getHours())}${pad2(date.getMinutes())}${pad2(date.getSeconds())}`;
}

export function formatTimestampForDisplay(date: Date): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function buildFrontmatter(model: string, exportedAt: string): string {
  return [
    "---",
    `title: \"${escapeYamlDoubleQuoted(READER_TITLE)}\"`,
    'source: "pi"',
    `model: \"${escapeYamlDoubleQuoted(model || "unknown")}\"`,
    `exported_at: \"${escapeYamlDoubleQuoted(exportedAt)}\"`,
    "---",
  ].join("\n");
}

export function buildMarkdownDocument(text: string, model: string, exportedAt: string): string {
  return `${buildFrontmatter(model, exportedAt)}\n\n${text.trimEnd()}\n`;
}

export function buildReaderFileName(extension: "md" | "html", date: Date): string {
  return `pi-reader-${formatTimestampForFilename(date)}.${extension}`;
}
