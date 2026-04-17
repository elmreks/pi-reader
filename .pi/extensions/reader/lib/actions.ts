import { buildMarkdownDocument, buildReaderFileName, formatTimestampForDisplay } from "./format.js";
import { openFileInBrowser, writeExportFile, writeTempHtmlFile } from "./files.js";
import { buildReaderHtml, renderMarkdownToHtml } from "./render.js";
import { getLastAssistantText } from "./session.js";

type NotifyLevel = "info" | "warning" | "error";

type ReaderCommandContext = {
  cwd: string;
  ui: {
    notify(message: string, level: NotifyLevel): void;
  };
  sessionManager: {
    getBranch(): unknown[];
  };
};

function getSourceOrNotify(ctx: ReaderCommandContext) {
  const source = getLastAssistantText(ctx.sessionManager.getBranch());
  if (!source) {
    ctx.ui.notify("No completed assistant message found", "warning");
    return null;
  }

  return source;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unknown error";
}

function buildReaderDocument(text: string, model: string, now: Date): string {
  return buildReaderHtml(renderMarkdownToHtml(text), model, formatTimestampForDisplay(now));
}

export async function runReaderExportMarkdown(ctx: ReaderCommandContext): Promise<void> {
  const source = getSourceOrNotify(ctx);
  if (!source) {
    return;
  }

  try {
    const now = new Date();
    const fileName = buildReaderFileName("md", now);
    const content = buildMarkdownDocument(source.text, source.model, now.toISOString());
    const filePath = await writeExportFile(ctx.cwd, fileName, content);

    ctx.ui.notify(`Exported markdown: ${filePath}`, "info");
  } catch (error) {
    ctx.ui.notify(`Failed to export markdown: ${getErrorMessage(error)}`, "error");
  }
}

export async function runReaderExportHtml(ctx: ReaderCommandContext): Promise<void> {
  const source = getSourceOrNotify(ctx);
  if (!source) {
    return;
  }

  try {
    const now = new Date();
    const fileName = buildReaderFileName("html", now);
    const html = buildReaderDocument(source.text, source.model, now);
    const filePath = await writeExportFile(ctx.cwd, fileName, html);

    ctx.ui.notify(`Exported HTML: ${filePath}`, "info");
  } catch (error) {
    ctx.ui.notify(`Failed to export HTML: ${getErrorMessage(error)}`, "error");
  }
}

export async function runReaderOpen(ctx: ReaderCommandContext): Promise<void> {
  const source = getSourceOrNotify(ctx);
  if (!source) {
    return;
  }

  let filePath = "";

  try {
    const now = new Date();
    const fileName = buildReaderFileName("html", now);
    const html = buildReaderDocument(source.text, source.model, now);
    filePath = await writeTempHtmlFile(fileName, html);
    await openFileInBrowser(filePath);

    ctx.ui.notify(`Opened reader in browser: ${filePath}`, "info");
  } catch (error) {
    const reason = getErrorMessage(error);
    const suffix = filePath ? ` File saved at: ${filePath}` : "";
    ctx.ui.notify(`Failed to open reader automatically (${reason}).${suffix}`, "warning");
  }
}

