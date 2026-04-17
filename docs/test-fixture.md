# Reader Test Fixture

This document is a **rendering test fixture** for the `reader` extension.

Use it to validate how exported markdown and rendered HTML handle common assistant response patterns.

---

## Paragraphs and inline formatting

This is a normal paragraph with **bold text**, *italic text*, ***bold italic text***, `inline code`, and a plain URL: https://pi.dev

Here is another paragraph with a [named link](https://pi.dev), some punctuation for typographer behavior -- including quotes like "hello" and apostrophes like don't.

## Lists

### Unordered list

- first item
- second item
- third item with `inline code`
  - nested child item
  - another nested child with **emphasis**
    - deeper nested item
- final item

### Ordered list

1. first ordered item
2. second ordered item
3. third ordered item
   1. nested ordered item
   2. another nested ordered item

### Task-style list

- [ ] unchecked task example
- [x] checked task example
- [ ] task with a [link](https://example.com)

## Blockquote

> This is a blockquote.
>
> It has multiple paragraphs and should feel readable.
>
> - It can include lists
> - and `inline code`

## Code

Inline code example: `const greeting = "hello";`

### Fenced code block

```ts
export function greet(name: string): string {
  const message = `Hello, ${name}!`;
  return message;
}
```

### Longer code block

```bash
npm install
npm run check
pi
/reload
/reader-export-html
```

## Table

| Column | Meaning | Notes |
| --- | --- | --- |
| name | display label | short text |
| status | current state | can be `draft`, `active`, or `done` |
| output | exported artifact | markdown or html |

## Horizontal rule

---

## Mixed content

Here is a paragraph before a list:

- item one
- item two
- item three

And here is a paragraph after the list, to verify spacing rhythm.

## Long line behavior

This is an intentionally long paragraph designed to test wrapping behavior in the centered article layout, especially when the content includes a longish sentence that keeps going for a while without any especially dramatic structure changes, just to see whether reading still feels calm and comfortable.

## Raw HTML behavior

This should stay literal or otherwise not become active HTML if markdown rendering is configured safely:

<div class="test-fixture-html">This is raw HTML in markdown.</div>

## Escaping and symbols

Characters to observe: < > & " ' — … ← →

## Final section

That should be enough to sanity-check the MVP rendering.
