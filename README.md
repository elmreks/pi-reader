# pi-reader

`pi-reader` is a pi package for opening and exporting the most recent completed assistant response in more readable formats.

## Current status
MVP working and packaged for pi installation.

User commands:
- `/reader-open`
- `/reader-export-md`
- `/reader-export-html`

Dev/test command:
- `/reader-preview-fixture` (disabled by default)

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
- `.pi/reader.json` — reader settings
- `docs/implementation-brief.md` — implementation decisions
- `docs/teaching-project-notes.md` — learning/build notes
- `docs/test-fixture.md` — reusable rendering test content

## Install in pi

Install from GitHub:

```bash
pi install git:github.com/elmreks/pi-reader
```

Install a pinned release tag:

```bash
pi install git:github.com/elmreks/pi-reader@v0.1.0
```

Project-local install instead:

```bash
pi install git:github.com/elmreks/pi-reader -l
```

Local checkout install for development:

```bash
pi install /absolute/path/to/pi-reader
```

Reload pi after changes during development:

```bash
/reload
```

## Local development
Fast styling loop:

```bash
pi
/reload
/reader-preview-fixture
```

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
- exported HTML includes a light/dark theme toggle and remembers the chosen theme locally in the browser
- temp browser-open files are currently kept in the system temp directory
- exports default to `~/Documents/reader-exports/`
- reader settings live in `.pi/reader.json`
- the fixture preview command is off by default and meant for development/testing

## Configuration
Example `.pi/reader.json`:

```json
{
  "exportDir": "~/Documents/reader-exports",
  "enableFixtureCommand": false
}
```

## Next areas for refinement
- text/typography polish
- better testing from real response samples
- temp-file cleanup strategy
- eventual packaging as a reusable pi package
