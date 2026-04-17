export type TextPart = {
  type: "text";
  text: string;
};

export type AssistantMessageLike = {
  role: "assistant";
  content: Array<{ type?: string; text?: string }>;
  model?: string;
  stopReason?: string;
  timestamp?: number;
};

type BranchEntryLike = {
  type?: string;
  id?: string;
  message?: unknown;
};

export type ReaderSource = {
  text: string;
  model: string;
  assistantTimestamp: number | null;
};

function isTextPart(part: unknown): part is TextPart {
  return typeof part === "object" && part !== null && "type" in part && part.type === "text" && "text" in part && typeof part.text === "string";
}

function isAssistantMessage(message: unknown): message is AssistantMessageLike {
  return (
    typeof message === "object" &&
    message !== null &&
    "role" in message &&
    message.role === "assistant" &&
    "content" in message &&
    Array.isArray(message.content)
  );
}

export function getLastAssistantMessage(branch: unknown[]): AssistantMessageLike | null {
  for (let index = branch.length - 1; index >= 0; index -= 1) {
    const entry = branch[index] as BranchEntryLike | undefined;
    if (entry?.type !== "message" || !isAssistantMessage(entry.message)) {
      continue;
    }

    if (entry.message.stopReason !== "stop") {
      continue;
    }

    const textParts = entry.message.content.filter(isTextPart);
    if (textParts.length === 0) {
      continue;
    }

    return entry.message;
  }

  return null;
}

export function getLastAssistantText(branch: unknown[]): ReaderSource | null {
  const message = getLastAssistantMessage(branch);
  if (!message) {
    return null;
  }

  const text = message.content.filter(isTextPart).map((part) => part.text).join("\n\n");
  if (!text.trim()) {
    return null;
  }

  return {
    text,
    model: message.model ?? "unknown",
    assistantTimestamp: typeof message.timestamp === "number" ? message.timestamp : null,
  };
}
