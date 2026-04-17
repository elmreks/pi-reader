import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";

import { runReaderExportHtml, runReaderExportMarkdown, runReaderOpen, runReaderPreviewFixture } from "./lib/actions.js";

export default function readerExtension(pi: ExtensionAPI) {
  pi.registerCommand("reader-open", {
    description: "Open the last completed assistant message in an external reader",
    handler: async (_args, ctx) => {
      await runReaderOpen(ctx);
    },
  });

  pi.registerCommand("reader-export-md", {
    description: "Export the last completed assistant message as markdown",
    handler: async (_args, ctx) => {
      await runReaderExportMarkdown(ctx);
    },
  });

  pi.registerCommand("reader-export-html", {
    description: "Export the last completed assistant message as HTML",
    handler: async (_args, ctx) => {
      await runReaderExportHtml(ctx);
    },
  });

  pi.registerCommand("reader-preview-fixture", {
    description: "Open the local test fixture in the reader without waiting for an assistant response",
    handler: async (_args, ctx) => {
      await runReaderPreviewFixture(ctx);
    },
  });
}
