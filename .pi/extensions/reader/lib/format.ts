const READER_TITLE = "pi msg export";

const CODE_LANGUAGE_TAGS: Record<string, string> = {
  ts: "typescript",
  tsx: "typescript",
  js: "javascript",
  jsx: "javascript",
  bash: "shell",
  sh: "shell",
  zsh: "shell",
  shell: "shell",
  json: "json",
  html: "html",
  css: "css",
  md: "markdown",
  markdown: "markdown",
  yaml: "yaml",
  yml: "yaml",
};

const SUBJECT_TAG_RULES: Array<{ tag: string; pattern: RegExp }> = [
  { tag: "git", pattern: /\b(git|commit|branch|rebase|stash)\b/i },
  { tag: "typography", pattern: /\b(typography|letter-spacing|line-height|font stack|font-family)\b/i },
  { tag: "markdown", pattern: /\b(frontmatter|markdown-it|markdown)\b/i },
  { tag: "pi-extension", pattern: /\b(\.pi\/extensions|registerCommand|ExtensionAPI|pi extension)\b/i },
];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[`*_~\[\](){}<>.,!?;:'"/\\|@#$%^&+=]/g, " ")
    .replace(/[^a-z0-9\s-]/g, " ")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeSlugParts(parts: string[]): string {
  const slug = slugify(parts.join(" "));
  if (!slug) {
    return "export";
  }

  return slug.split("-").slice(0, 6).join("-").slice(0, 40) || "export";
}

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
  ].join("-");
}

export function formatTimestampForDisplay(date: Date): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function appendTag(tags: string[], seen: Set<string>, tag: string): void {
  const normalized = tag.trim().toLowerCase();
  if (!normalized || seen.has(normalized)) {
    return;
  }

  seen.add(normalized);
  tags.push(normalized);
}

export function deriveTagsFromContent(text: string): string[] {
  const tags: string[] = [];
  const seen = new Set<string>();
  const source = text.toLowerCase();

  appendTag(tags, seen, "pi");

  const codeBlockMatches = [...text.matchAll(/```([a-zA-Z0-9_-]+)?\n[\s\S]*?```/g)];
  if (codeBlockMatches.length > 0) {
    appendTag(tags, seen, "code");
  }

  for (const match of codeBlockMatches) {
    const language = match[1]?.toLowerCase();
    if (!language) {
      continue;
    }

    const mappedTag = CODE_LANGUAGE_TAGS[language];
    if (mappedTag) {
      appendTag(tags, seen, mappedTag);
    }
  }

  if (/^>\s/m.test(text)) {
    appendTag(tags, seen, "quote");
  }

  if (/^(?:-|\*|\+)\s|^\d+\.\s/m.test(text)) {
    appendTag(tags, seen, "list");
  }

  if (/^\|.+\|\s*$/m.test(text) && /^\|(?:\s*:?-+:?\s*\|)+\s*$/m.test(text)) {
    appendTag(tags, seen, "table");
  }

  for (const rule of SUBJECT_TAG_RULES) {
    if (rule.pattern.test(source)) {
      appendTag(tags, seen, rule.tag);
    }
  }

  return tags;
}

export function buildFrontmatter(model: string, exportedAt: string, tags: string[]): string {
  const lines = [
    "---",
    `title: \"${escapeYamlDoubleQuoted(READER_TITLE)}\"`,
    'source: "pi"',
    `model: \"${escapeYamlDoubleQuoted(model || "unknown")}\"`,
    `exported_at: \"${escapeYamlDoubleQuoted(exportedAt)}\"`,
    "tags:",
    ...tags.map((tag) => `  - ${escapeYamlDoubleQuoted(tag)}`),
    "---",
  ];

  return lines.join("\n");
}

export function buildMarkdownDocument(text: string, model: string, exportedAt: string): string {
  const tags = deriveTagsFromContent(text);
  return `${buildFrontmatter(model, exportedAt, tags)}\n\n${text.trimEnd()}\n`;
}

export function deriveSlugFromContent(text: string): string {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const preferredLine =
    lines.find((line) => /^#{1,6}\s+/.test(line)) ??
    lines.find((line) => !/^```/.test(line) && !/^[-*+]\s*$/.test(line) && !/^\|(?:\s*:?-+:?\s*\|)+\s*$/.test(line)) ??
    lines[0];

  if (!preferredLine) {
    return "export";
  }

  const cleanedLine = preferredLine
    .replace(/^#{1,6}\s+/, "")
    .replace(/^[-*+]\s+/, "")
    .replace(/^\d+\.\s+/, "")
    .replace(/^>\s+/, "");

  return normalizeSlugParts(cleanedLine.split(/\s+/));
}

export function buildReaderFileName(extension: "md" | "html", date: Date, text: string): string {
  const slug = deriveSlugFromContent(text);
  return `pi-msg-${formatTimestampForFilename(date)}-${slug}.${extension}`;
}
