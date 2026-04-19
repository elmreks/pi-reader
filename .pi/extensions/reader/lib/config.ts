import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";

export type ReaderConfig = {
  exportDir: string;
  enableFixtureCommand: boolean;
};

const DEFAULT_EXPORT_DIR = "~/Documents/reader-exports";

function expandHomePath(value: string): string {
  if (value === "~") {
    return homedir();
  }

  if (value.startsWith("~/")) {
    return join(homedir(), value.slice(2));
  }

  return value;
}

export function getDefaultReaderConfig(): ReaderConfig {
  return {
    exportDir: expandHomePath(DEFAULT_EXPORT_DIR),
    enableFixtureCommand: false,
  };
}

export async function loadReaderConfig(cwd: string): Promise<ReaderConfig> {
  const configPath = join(cwd, ".pi", "reader.json");
  const defaults = getDefaultReaderConfig();

  try {
    const raw = await readFile(configPath, "utf8");
    const parsed = JSON.parse(raw) as { exportDir?: unknown; enableFixtureCommand?: unknown };

    return {
      exportDir: typeof parsed.exportDir === "string" && parsed.exportDir.trim()
        ? expandHomePath(parsed.exportDir.trim())
        : defaults.exportDir,
      enableFixtureCommand: typeof parsed.enableFixtureCommand === "boolean"
        ? parsed.enableFixtureCommand
        : defaults.enableFixtureCommand,
    };
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return defaults;
    }

    throw error;
  }
}
