# pi-reader

`reader` is a local pi extension for opening and exporting the most recent completed assistant response in more readable formats.

## Current status
MVP working.

Commands:
- `/reader-open`
- `/reader-export-md`
- `/reader-export-html`

## What it does
The extension targets the last assistant message on the current branch that:
- has `role === "assistant"`
- has `stopReason === "stop"`
- contains text parts

It then:
- exports exact assistant text to markdown
- renders markdown to a styled static HTML document
- can open the HTML in the default browser on macOS

## Project structure
- `.pi/extensions/reader/` — extension code
- `docs/implementation-brief.md` — implementation decisions
- `docs/teaching-project-notes.md` — learning/build notes
- `docs/test-fixture.md` — reusable rendering test content
- `reader-exports/` — default export directory

## Local development
Install dependencies:

```bash
npm install
```

Type-check:

```bash
npm run check
```

Run pi from this repo, then reload extensions:

```bash
pi
/reload
```

## Notes
- HTML output uses `markdown-it`
- exported HTML is static and dependency-free
- temp browser-open files are currently kept in the system temp directory
- export files are written to `./reader-exports/`

## Next areas for refinement
- HTML visual polish
- better testing from real response samples
- temp-file cleanup strategy
- eventual packaging as a reusable pi package
