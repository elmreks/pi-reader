import { execFile } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, parse } from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

async function writeUniqueFile(directory: string, fileName: string, content: string): Promise<string> {
  const { name, ext } = parse(fileName);

  for (let attempt = 0; attempt < 1000; attempt += 1) {
    const suffix = attempt === 0 ? "" : `-${attempt + 1}`;
    const candidatePath = join(directory, `${name}${suffix}${ext}`);

    try {
      await writeFile(candidatePath, content, { encoding: "utf8", flag: "wx" });
      return candidatePath;
    } catch (error) {
      if (!(error instanceof Error) || !("code" in error) || error.code !== "EEXIST") {
        throw error;
      }
    }
  }

  throw new Error(`Could not create a unique reader file for ${fileName}`);
}

export async function ensureExportDir(exportDir: string): Promise<string> {
  await mkdir(exportDir, { recursive: true });
  return exportDir;
}

export async function writeExportFile(exportDir: string, fileName: string, content: string): Promise<string> {
  await ensureExportDir(exportDir);
  return writeUniqueFile(exportDir, fileName, content);
}

export async function writeTempHtmlFile(fileName: string, content: string): Promise<string> {
  const filePath = await writeUniqueFile(tmpdir(), fileName, content);
  // TODO: clean up temp reader files after browser-open behavior is stable.
  return filePath;
}

export async function openFileInBrowser(filePath: string): Promise<void> {
  if (process.platform !== "darwin") {
    throw new Error("Automatic browser opening is currently implemented for macOS only.");
  }

  await execFileAsync("open", [filePath]);
}
