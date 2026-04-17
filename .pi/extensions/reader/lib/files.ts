import { execFile } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const EXPORT_DIR_NAME = "reader-exports";

export async function ensureExportDir(cwd: string): Promise<string> {
  const exportDir = join(cwd, EXPORT_DIR_NAME);
  await mkdir(exportDir, { recursive: true });
  return exportDir;
}

export async function writeExportFile(cwd: string, fileName: string, content: string): Promise<string> {
  const exportDir = await ensureExportDir(cwd);
  const filePath = join(exportDir, fileName);
  await writeFile(filePath, content, "utf8");
  return filePath;
}

export async function writeTempHtmlFile(fileName: string, content: string): Promise<string> {
  const filePath = join(tmpdir(), fileName);
  await writeFile(filePath, content, "utf8");
  // TODO: clean up temp reader files after browser-open behavior is stable.
  return filePath;
}

export async function openFileInBrowser(filePath: string): Promise<void> {
  if (process.platform !== "darwin") {
    throw new Error("Automatic browser opening is currently implemented for macOS only.");
  }

  await execFileAsync("open", [filePath]);
}
