# reader project instructions

## Purpose
Build a local pi extension called `reader` that improves reading/exporting assistant responses.

## Current phase
MVP refinement and package-prep phase.
Do not jump into broad implementation changes without first checking the project brief and spec.

## Primary spec
- `./spec.md`
- `./docs/implementation-brief.md`

## Product direction
- Local pi extension first
- Structured so it can later become a reusable pi package
- TypeScript
- Minimal dependencies
- Allow one markdown rendering library for better HTML output
- Generated HTML must remain static and dependency-free

## MVP scope
Commands planned for v1:
- `/reader-open`
- `/reader-export-md`
- `/reader-export-html`

Source selection rules:
- current branch only
- most recent completed assistant message
- `stopReason === "stop"`
- text parts only

## Export defaults
- Markdown export keeps exact assistant text content
- HTML export renders markdown for readability
- Missing model value should be `"unknown"`
- Filenames use local date plus a short slug
- Save exported files into `~/Documents/reader-exports/` by default
- Export behavior should respect `.pi/reader.json`
- Temp browser-open files can remain in temp for now
- Add TODO for future temp cleanup

## Implementation guidance
- Prefer small pure helpers
- Keep command handlers thin
- Separate extraction, formatting, rendering, file writing, and browser opening
- Ignore non-text message parts unless explicitly needed
- Favor explicit failure notifications

## Project layout intent
- `.pi/extensions/reader/` contains the local extension entry point and helpers
- `.pi/reader.json` contains reader-specific settings
- `docs/` contains design and implementation notes
- `~/Documents/reader-exports/` is the default manual drop directory for exports

## Before coding
1. Read `spec.md`
2. Read `docs/implementation-brief.md`
3. Preserve the current scope unless asked to expand it

## Style
- Be concise
- Prefer clear names over clever ones
- Keep TODOs explicit and narrow
