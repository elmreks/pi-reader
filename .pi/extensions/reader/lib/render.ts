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
        color-scheme: dark;
        --bg: #0f1113;
        --surface: rgba(20, 24, 29, 0.84);
        --surface-2: #1d232b;
        --surface-3: #14191f;
        --text: #e6edf3;
        --muted: #b0b5bd;
        --line: #2a313a;
        --line-soft: rgba(255, 255, 255, 0.06);
        --link: #8ec5ff;
        --quote: #7dd3a7;
        --code-bg: #0d1117;
        --code-text: #d9e2ec;
        --selection: rgba(142, 197, 255, 0.18);
      }

      * { box-sizing: border-box; }

      html, body {
        margin: 0;
        padding: 0;
        background:
          radial-gradient(circle at top, rgba(75, 94, 122, 0.18) 0%, rgba(75, 94, 122, 0) 34%),
          linear-gradient(180deg, #14181d 0%, var(--bg) 42%);
        color: var(--text);
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }

      ::selection {
        background: var(--selection);
      }

      body {
        padding: 40px 20px 64px;
      }

      .shell {
        max-width: 940px;
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
        border-radius: 18px;
        background: var(--surface);
        backdrop-filter: blur(14px);
        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.24);
      }

      .title {
        display: flex;
        flex-direction: column;
        gap: 4px;
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
        color: var(--muted);
        font-size: 14px;
      }

      .meta strong {
        color: var(--muted);
        font-weight: 600;
      }

      article {
        max-width: 920px;
        margin: 0 auto;
        padding: 42px 44px;
        border: 1px solid var(--line-soft);
        border-radius: 24px;
        background: linear-gradient(180deg, rgba(27, 33, 39, 0.98), rgba(16, 20, 25, 0.99));
        box-shadow: 0 22px 70px rgba(0, 0, 0, 0.3);
      }

      article > :first-child { margin-top: 0; }
      article > :last-child { margin-bottom: 0; }

      h1, h2, h3, h4, h5, h6 {
        line-height: 1.2;
        margin: 1.8em 0 0.72em;
        font-weight: 700;
        letter-spacing: -0.02em;
      }

      h1 { font-size: 2.2rem; }
      h2 { font-size: 1.65rem; }
      h3 { font-size: 1.3rem; }

      p, li, blockquote {
        font-size: 1.12rem;
        line-height: 1.5;
      }

      p, ul, ol, pre, blockquote, table {
        margin: 0 0 1em;
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
        margin-top: 0.35em;
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
        border-left: 3px solid rgba(125, 211, 167, 0.45);
        color: #d4eadc;
        background: linear-gradient(90deg, rgba(125, 211, 167, 0.08), rgba(125, 211, 167, 0));
      }

      code {
        font-family: "SFMono-Regular", SFMono-Regular, ui-monospace, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
        font-size: 0.92em;
        padding: 0.18em 0.42em;
        border-radius: 6px;
        background: rgba(13, 17, 23, 0.95);
        color: var(--code-text);
      }

      pre {
        overflow-x: auto;
        padding: 16px 18px;
        border: 1px solid var(--line);
        border-radius: 16px;
        background: linear-gradient(180deg, #0f141b, var(--code-bg));
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.02);
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
        background: rgba(255, 255, 255, 0.015);
      }

      img {
        max-width: 100%;
        height: auto;
        border-radius: 14px;
      }

      @media (max-width: 720px) {
        body {
          padding: 20px 12px 40px;
        }

        article {
          padding: 26px 20px;
          border-radius: 20px;
        }

        header {
          padding: 12px 14px;
          border-radius: 16px;
        }

        h1 { font-size: 1.9rem; }
        h2 { font-size: 1.45rem; }
      }
    </style>
  </head>
  <body>
    <div class="shell">
      <header>
        <div class="title">
          <div class="eyebrow">pi reader</div>
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
  </body>
</html>
`;
}
