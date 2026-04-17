import MarkdownIt from "markdown-it";

const markdown = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
});

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function renderMarkdownToHtml(source: string): string {
  return markdown.render(source);
}

export function buildReaderHtml(contentHtml: string, model: string, timestampLabel: string): string {
  const safeModel = escapeHtml(model || "unknown");
  const safeTimestamp = escapeHtml(timestampLabel);

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>pi reader</title>
    <style>
      :root {
        color-scheme: dark light;
        --bg: #151719;
        --bg-accent: rgba(96, 110, 128, 0.14);
        --surface: rgba(23, 25, 28, 0.84);
        --surface-2: #24272b;
        --surface-3: #1b1e22;
        --text: #e7ebef;
        --muted: #afb4bb;
        --line: rgba(255, 255, 255, 0.1);
        --line-soft: rgba(255, 255, 255, 0.07);
        --link: #69aefc;
        --quote: #6bbf97;
        --code-bg: #1b1d21;
        --code-text: #e0e5ea;
        --selection: rgba(105, 174, 252, 0.18);
        --shadow: 0 18px 52px rgba(0, 0, 0, 0.16);
        --frame-width: 1008px;
        --font-body: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", "Segoe UI", sans-serif;
        --font-heading: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Segoe UI", sans-serif;
        --font-code: "SFMono-Regular", SFMono-Regular, ui-monospace, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
      }

      @media (prefers-color-scheme: light) {
        :root:not([data-theme="dark"]) {
          --bg: #f3efe8;
          --bg-accent: rgba(171, 157, 135, 0.12);
          --surface: rgba(255, 252, 247, 0.9);
          --surface-2: #f3ece3;
          --surface-3: #f7f2eb;
          --text: #3b3a38;
          --muted: #7e7871;
          --line: #e6e3de;
          --line-soft: rgba(68, 56, 42, 0.08);
          --link: #eb5a52;
          --quote: #4f8f73;
          --code-bg: #f1f3f5;
          --code-text: #2f2d2b;
          --selection: rgba(235, 90, 82, 0.14);
          --shadow: 0 18px 44px rgba(69, 55, 38, 0.08);
        }
      }

      :root[data-theme="light"] {
        --bg: #f3efe8;
        --bg-accent: rgba(171, 157, 135, 0.12);
        --surface: rgba(255, 252, 247, 0.9);
        --surface-2: #f3ece3;
        --surface-3: #f7f2eb;
        --text: #3b3a38;
        --muted: #7e7871;
        --line: #e6e3de;
        --line-soft: rgba(68, 56, 42, 0.08);
        --link: #eb5a52;
        --quote: #4f8f73;
        --code-bg: #f1f3f5;
        --code-text: #2f2d2b;
        --selection: rgba(235, 90, 82, 0.14);
        --shadow: 0 18px 44px rgba(69, 55, 38, 0.08);
      }

      * { box-sizing: border-box; }

      html, body {
        margin: 0;
        padding: 0;
        background:
          radial-gradient(circle at top, var(--bg-accent) 0%, transparent 34%),
          linear-gradient(180deg, color-mix(in srgb, var(--bg) 92%, black 8%) 0%, var(--bg) 42%);
        color: var(--text);
        font-family: var(--font-body);
      }

      ::selection {
        background: var(--selection);
      }

      body {
        padding: 40px 20px 64px;
      }

      .shell {
        max-width: var(--frame-width);
        margin: 0 auto;
      }

      header {
        display: flex;
        flex-wrap: wrap;
        gap: 10px 18px;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 22px;
        padding: 16px 18px;
        border: 1px solid var(--line-soft);
        border-radius: 5px;
        background: var(--surface);
        backdrop-filter: blur(14px);
      }

      .title {
        display: flex;
        align-items: center;
        gap: 18px;
      }

      .eyebrow {
        color: var(--muted);
        font-size: 12px;
        letter-spacing: 0.14em;
        text-transform: uppercase;
      }

      .meta {
        display: flex;
        flex-wrap: wrap;
        gap: 8px 14px;
        align-items: center;
        justify-content: flex-end;
        color: var(--muted);
        font-size: 14px;
      }

      .meta strong {
        color: var(--muted);
        font-weight: 600;
      }

      .theme-toggle {
        appearance: none;
        border: 0;
        background: transparent;
        color: var(--muted);
        padding: 0;
        font: inherit;
        font-size: 12px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        cursor: pointer;
      }

      .theme-toggle:hover {
        color: var(--text);
      }

      article {
        width: 100%;
        margin: 0;
        padding: 42px 44px;
        border: 1px solid var(--line-soft);
        border-radius: 5px;
        background: var(--surface);
        box-shadow: var(--shadow);
      }

      article > :first-child { margin-top: 0; }
      article > :last-child { margin-bottom: 0; }

      h1, h2, h3, h4, h5, h6 {
        font-family: var(--font-heading);
        line-height: 1.2;
        margin: 1.65em 0 0.76em;
        font-weight: 700;
        letter-spacing: 0.036em;
      }

      h1 { font-size: 1.92rem; }
      h2 { font-size: 1.46rem; }
      h3 { font-size: 1.18rem; }

      p, li, blockquote {
        font-size: 1.05rem;
        line-height: 1.72;
        letter-spacing: 0.027em;
      }

      p, ul, ol, pre, blockquote, table {
        margin: 0 0 1.12em;
      }

      ul, ol {
        padding-left: 1.45em;
      }

      p {
        max-width: 48em;
      }

      ul ul, ol ol, ul ol, ol ul {
        margin-top: 0.5em;
        margin-bottom: 0.5em;
      }

      li + li {
        margin-top: 0.42em;
      }

      li::marker {
        color: var(--link);
      }

      a {
        color: var(--link);
        text-decoration: none;
      }

      a:hover {
        text-decoration: underline;
      }

      blockquote {
        margin-left: 0;
        padding: 0.35em 0 0.35em 1.1em;
        border-left: 3px solid color-mix(in srgb, var(--quote) 72%, transparent);
        color: color-mix(in srgb, var(--text) 88%, var(--quote) 12%);
        background: linear-gradient(90deg, color-mix(in srgb, var(--quote) 10%, transparent), transparent);
      }

      code {
        font-family: var(--font-code);
        font-size: 0.86em;
        letter-spacing: 0.01em;
        padding: 0.14em 0.34em;
        border-radius: 0;
        background: var(--code-bg);
        color: var(--code-text);
      }

      pre {
        overflow-x: auto;
        padding: 16px 18px;
        border: 1px solid var(--line);
        border-radius: 4px;
        background: var(--code-bg);
      }

      pre code {
        display: block;
        padding: 0;
        background: transparent;
        line-height: 1.65;
      }

      hr {
        border: 0;
        border-top: 1px solid var(--line);
        margin: 2.2em 0;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.98rem;
      }

      th, td {
        padding: 10px 12px;
        border: 1px solid var(--line);
        text-align: left;
        vertical-align: top;
      }

      th {
        background: var(--surface-2);
      }

      tr:nth-child(even) td {
        background: color-mix(in srgb, var(--surface-2) 38%, transparent);
      }

      img {
        max-width: 100%;
        height: auto;
        border-radius: 3px;
      }

      @media (max-width: 720px) {
        body {
          padding: 20px 12px 40px;
        }

        .title,
        .meta {
          width: 100%;
        }

        .meta {
          justify-content: flex-start;
        }

        article {
          padding: 26px 20px;
          border-radius: 5px;
        }

        header {
          padding: 12px 14px;
          border-radius: 5px;
        }

        h1 { font-size: 1.72rem; }
        h2 { font-size: 1.32rem; }
      }
    </style>
  </head>
  <body>
    <div class="shell">
      <header>
        <div class="title">
          <div class="eyebrow">pi reader</div>
          <button class="theme-toggle" type="button" aria-label="Toggle color theme">[Light / Dark]</button>
        </div>
        <div class="meta">
          <span><strong>Exported:</strong> ${safeTimestamp}</span>
          <span><strong>Model:</strong> ${safeModel}</span>
        </div>
      </header>
      <article>
        ${contentHtml}
      </article>
    </div>
    <script>
      (() => {
        const storageKey = "pi-reader-theme";
        const root = document.documentElement;
        const button = document.querySelector(".theme-toggle");
        if (!button) return;

        const getSystemTheme = () => window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";

        const applyTheme = (theme) => {
          root.dataset.theme = theme;
          button.textContent = theme === "light" ? "[Light / dark]" : "[Light / Dark]";
          button.setAttribute("aria-label", theme === "light" ? "Switch to dark mode" : "Switch to light mode");
        };

        const savedTheme = window.localStorage.getItem(storageKey);
        applyTheme(savedTheme === "light" || savedTheme === "dark" ? savedTheme : getSystemTheme());

        button.addEventListener("click", () => {
          const nextTheme = root.dataset.theme === "light" ? "dark" : "light";
          window.localStorage.setItem(storageKey, nextTheme);
          applyTheme(nextTheme);
        });
      })();
    </script>
  </body>
</html>
`;
}
