# reader implementation brief

## What we are scaffolding
This project starts as a **local pi extension** inside this repo.

That means:
- pi can auto-discover it from `.pi/extensions/`
- we can iterate fast without publishing anything
- we can later convert or promote it into a shareable pi package with minimal restructuring

## Decisions locked in
- Form: local pi extension, package-ready structure
- Language: TypeScript
- Scope: current branch only
- Source message: last completed assistant message with `stopReason === "stop"`
- Text extraction: text parts only
- Markdown export: exact text, joined with blank lines
- HTML export: markdown rendered to readable HTML
- Markdown renderer: `markdown-it`
- Missing model: `"unknown"`
- Filename timestamps: local time
- Export directory: `./reader-exports/`
- Temp HTML files: keep for now
- Future work: add temp cleanup after behavior is stable

## The "one library" idea
You said yes to **one markdown library**. Here is what that means.

There are two different layers:

### 1. Extension/runtime dependency
This is a normal npm package used by our TypeScript extension code while generating output.

Example jobs for that library:
- convert markdown text into HTML
- maybe sanitize or format output

This dependency exists **only in the extension code**, not in the exported HTML file.

### 2. Generated artifact dependency
This would mean the exported HTML needs external JS, CSS, or a build system to work.

We do **not** want that.

So the plan is:
- use one npm markdown library during export generation
- specifically use `markdown-it` for markdown-to-HTML conversion
- emit a single static HTML file with inline CSS
- no JS, no CDN, no framework in the final artifact

In plain English: we can use one tool to *make* the document, but the document itself should stand on its own.

## Why scaffold this way

### `.pi/extensions/reader/`
This is where the local extension will live.
Pi auto-discovers project-local extensions from this path, which keeps the project aligned with pi's conventions.

### root `package.json`
This gives us a clean place for TypeScript and one markdown dependency.
It also makes the project feel like a normal Node/TS repo.

### `docs/`
We keep decisions, rationale, and future packaging notes out of the code.
That makes it easier to learn the system while building.

### `reader-exports/`
This is the manual drop directory for saved `.md` and `.html` exports.
Later, you can automate sorting or syncing from one predictable place.

## Current implementation shape
The MVP is now split into these extension files:

- `.pi/extensions/reader/index.ts`
- `.pi/extensions/reader/lib/actions.ts`
- `.pi/extensions/reader/lib/session.ts`
- `.pi/extensions/reader/lib/format.ts`
- `.pi/extensions/reader/lib/render.ts`
- `.pi/extensions/reader/lib/files.ts`

The responsibilities separate naturally:
- command wiring
- session lookup + text extraction
- markdown/frontmatter formatting
- HTML rendering
- file output + browser open

## MVP command flow
For `/reader-export-md`:
1. inspect current branch via `ctx.sessionManager.getBranch()`
2. find last valid assistant message
3. extract text parts and join with blank lines
4. build YAML frontmatter
5. write to `reader-exports/pi-reader-YYYY-MM-DD-HHmmss.md`
6. notify user of success/failure

For `/reader-export-html`:
1. reuse the same message extraction
2. render markdown with `markdown-it`
3. wrap the HTML in a static document template with inline CSS
4. write to `reader-exports/pi-reader-YYYY-MM-DD-HHmmss.html`
5. notify user of success/failure

For `/reader-open`:
1. reuse the same HTML rendering path
2. write a temp HTML file
3. open it with macOS `open`
4. keep the temp file even on failure
5. notify user of the path

## Packaging path later
If we want to publish this later, we already have the right mental model:
- current repo is a normal TS project
- extension code is isolated
- docs and defaults are explicit

Later we can add a `pi` manifest in `package.json` and make it installable as a pi package.

## TODOs already known
- run install + type-check in the local environment
- manually test the three commands inside pi
- tune HTML typography and spacing from real exports
- decide whether to expose export directory as a setting later
- add temp-file cleanup strategy later
- package the extension when local behavior feels stable
