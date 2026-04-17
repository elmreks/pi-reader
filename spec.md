# Project: reader

Codename: `reader`
Status: draft / scoped

## Goal
Create a two-path reading/export system for pi assistant responses:

1. **In-terminal reader**
   - fast
   - convenient
   - good enough for everyday use

2. **External reader**
   - polished
   - browser-based HTML reading experience
   - exportable as markdown and HTML

---

## Current direction
The in-terminal reader exists and is considered **good enough for utility**.

The next major focus is the **external reader MVP**.

---

## External Reader MVP

### Purpose
Create a fast external reading/export flow for the **last completed assistant message**.

### Commands
#### `/reader-open`
- Find last completed assistant message
- Render to styled HTML
- Write to a temp file
- Open in default browser
- Notify user of temp file path

#### `/reader-export-md`
- Find last completed assistant message
- Export as markdown with frontmatter
- Save in current working directory
- Use timestamped filename
- Notify user of saved path

#### `/reader-export-html`
- Find last completed assistant message
- Render same styled HTML
- Save in current working directory
- Use timestamped filename
- Notify user of saved path

---

## Source selection
Use:
- most recent message on current branch
- role = `assistant`
- `stopReason === "stop"`
- text parts only

If no valid message exists:
- show warning
- do nothing

---

## Markdown export format

### File name
Default:
- `pi-reader-YYYY-MM-DD-HHmmss.md`

### Frontmatter
Use lightweight YAML:

```yaml
---
title: "pi reader export"
source: "pi"
model: "<model-id>"
exported_at: "<ISO timestamp>"
---
```

### Body
- exact assistant text content
- join text blocks with blank lines
- no rewriting
- no cleanup beyond block joining

---

## HTML output

### File name
For export:
- `pi-reader-YYYY-MM-DD-HHmmss.html`

For open:
- temp file with similar name

### HTML behavior
- static single file
- inline CSS only
- no JS required for MVP
- no build step
- no external dependencies

### Page structure
- minimal header
  - label: `pi reader`
  - timestamp
  - model (if available)
- main centered article column
- markdown-rendered content

---

## Visual design

### Goal
A calm, polished reading document.

### Theme
Start with:
- **one dark theme**

### Style direction
- centered content column
- max width around 720–820px
- generous vertical spacing
- clean heading hierarchy
- soft dark background
- subtle card/page surface
- good code block styling
- readable links/lists/quotes

### Non-goals
- exact Bear clone
- theme picker
- animations
- app-like UI

---

## Browser opening
On macOS:
- use `open <file>`

If opening fails:
- keep file
- notify user with path

---

## Notifications
Each command should notify:
- success + output path
- or failure reason

Examples:
- `Opened reader in browser: /var/folders/.../pi-reader-....html`
- `Exported markdown: /path/to/pi-reader-....md`
- `No completed assistant message found`

---

## Suggested implementation structure

### Helpers
- `getLastAssistantMessage(...)`
- `getLastAssistantText(...)`
- `formatTimestampForFilename(...)`
- `buildFrontmatter(...)`
- `buildReaderHtml(...)`
- `writeTempHtmlAndOpen(...)`

### Commands
- register `/reader-open`
- register `/reader-export-md`
- register `/reader-export-html`

---

## Rendering approach
For MVP:
- render markdown properly to HTML if possible
- otherwise use the lightest acceptable fallback only temporarily

Ideal MVP:
- proper markdown-to-HTML rendering

---

## Edge cases

### 1. No assistant message
- warn and exit

### 2. Assistant message has multiple text parts
- join with blank lines

### 3. Assistant message includes non-text content
- ignore non-text parts

### 4. Export collision
Recommendation:
- include seconds in timestamp to avoid collisions

---

## Out of scope for v1
- choosing older messages
- title inference
- PDF export
- light theme
- search
- clipboard integration
- Bear-specific export hooks

---

## Phase plan

### Phase 1
Build the external reader MVP:
- `/reader-open`
- `/reader-export-md`
- `/reader-export-html`

### Phase 2
Refine:
- naming
- light theme
- better markdown rendering if needed
- future export options

---

## Notes
The terminal reader should remain available as the quick in-pi option.

The external reader is the place to pursue the more document-like, polished reading experience.
