# reader teaching project notes

## Purpose
This document captures how we are building `reader` as a **teaching project**.

The goal is not just to ship the extension, but to learn:
- how pi projects are started
- how local pi extensions are structured
- how implementation decisions are made
- how to turn a product spec into a clean MVP build

## Teaching project mode
For this project, we are using a simple rule:

> explain the reason before the code

That means each meaningful step should answer:
1. what are we building?
2. why does it exist?
3. why this shape instead of another one?
4. what is the smallest correct version?
5. what did we learn?

## Working rules
- prefer small vertical slices
- keep abstractions earned, not premature
- write down decisions when they matter
- separate MVP from later ideas
- keep docs practical, not ceremonial

## Current project status
The MVP is implemented and actively being refined.

Current files/folders:
- `spec.md`
- `AGENTS.md`
- `.pi/settings.json`
- `.pi/reader.json`
- `.pi/extensions/reader/index.ts`
- `docs/implementation-brief.md`
- `docs/test-fixture.md`
- `package.json`
- `tsconfig.json`

## Teaching note 001: why this scaffold exists

### What we built
A project-local pi extension scaffold.

### Why it exists
We want `reader` to start as a local extension that is easy to test in this repo, while staying organized enough to become a package later.

### Why this structure

#### `spec.md`
This is the product/source-of-truth doc.
It says what the feature should do.

#### `AGENTS.md`
This is the repo operating guide for pi.
It tells the coding agent how to behave in this project.

In practice:
- the spec defines the product
- `AGENTS.md` defines the working rules

#### `.pi/settings.json`
This is where project-local pi settings live.
Right now it is minimal, but it gives us a project-specific configuration point.

#### `.pi/extensions/reader/index.ts`
This is the local extension entry point.
Pi auto-discovers project-local extensions from `.pi/extensions/`.

This matters because it means we do **not** need a separate publishing step just to start building.

#### `package.json`
This makes the repo a normal TypeScript/Node project.
It gives us a place for:
- TypeScript
- one markdown dependency later
- check scripts

#### `tsconfig.json`
This keeps the extension code type-checked and disciplined.
Even though pi can run TypeScript directly, type-checking helps us learn the API safely.

#### `.pi/reader.json`
This is the reader-specific settings file.
It gives the project a clean place for user-facing extension settings like export directory and fixture preview behavior.

#### `docs/implementation-brief.md`
This captures the decisions we already made so they do not stay trapped in chat history.

### Smallest correct idea behind the scaffold
The scaffold should do only enough to answer these questions:
- where does the extension live?
- where do outputs go?
- where do decisions live?
- how will we type-check the code?

It should **not** try to fully implement the product yet.

### What we learned
- pi project startup is lightweight; there is no special built-in project init flow
- a local pi extension can live directly in `.pi/extensions/`
- a good scaffold separates product spec, agent instructions, implementation notes, and code entry point
- starting local first does not block packaging later

## Teaching note 002: local extension discovery in pi

### Key idea
Pi auto-discovers project-local extensions in:
- `.pi/extensions/*.ts`
- `.pi/extensions/*/index.ts`

That is why `reader` lives at:
- `.pi/extensions/reader/index.ts`

### Why this matters
This gives us a very fast build loop:
1. edit extension code
2. run pi in this repo
3. use `/reload`
4. test commands

No package publish cycle is required.

### What this means for our design
We can treat this repo like:
- a real TS project
- with a local pi extension inside it
- and docs next to it

That is ideal for a first extension.

## Teaching note 003: choosing the markdown library

### What we chose
We chose `markdown-it` as the single markdown rendering dependency.

### Why
It gives us a good balance:
- simple mental model
- solid markdown coverage
- room to extend later if needed

### Important distinction
The dependency exists in the extension code, not in the exported HTML artifact.

That means:
- the extension can depend on `markdown-it`
- the saved HTML file still stays static and dependency-free

### What we learned
A good dependency for this project should be:
- narrow in scope
- easy to explain
- easy to replace later
- invisible in the final exported artifact

## Teaching note 004: the MVP data flow

### Core pipeline
The reader MVP follows this path:

1. current branch from `ctx.sessionManager.getBranch()`
2. last assistant message on that branch
3. only messages with `stopReason === "stop"`
4. only text parts from the message content
5. join text parts with blank lines
6. branch into one of three outputs:
   - markdown export
   - HTML export
   - temp HTML + browser open

### Why this is a good shape
This keeps the project honest:
- one source extraction path
- multiple output paths
- thin command handlers

That reduces duplicated logic and makes the spec easier to preserve.

### What we learned
A useful way to structure extension work is:
- shared extraction path first
- output-specific formatting second
- side effects last

## Current implementation status
The MVP is now implemented in code.

User commands wired:
- `/reader-open`
- `/reader-export-md`
- `/reader-export-html`

Dev/test command:
- `/reader-preview-fixture`

Current module split:
- `index.ts` for command registration
- `lib/actions.ts` for top-level command flows
- `lib/config.ts` for reader settings
- `lib/session.ts` for message lookup and text extraction
- `lib/format.ts` for filenames, slugs, tags, and frontmatter
- `lib/render.ts` for markdown-to-HTML and page template
- `lib/files.ts` for export writing and browser opening

## Open teaching topics
We plan to cover these next:
- how to test a pi extension incrementally
- how to tune HTML output from real examples
- how to decide when local extension code is ready to become a package
- how to document MVP tradeoffs without over-designing

## Reusable startup pattern for future projects
A practical starter pattern for future pi projects:
1. create repo dir
2. add `spec.md`
3. add `AGENTS.md`
4. add `.pi/settings.json`
5. create `.pi/extensions/<name>/index.ts`
6. add `package.json` + `tsconfig.json`
7. create one output/docs directory if relevant
8. implement one thin vertical slice first
