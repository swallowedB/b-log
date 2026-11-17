import type { ChatInput } from "./types";

const record = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === "object" && !Array.isArray(value);
const length = (value: string) => Array.from(value).length;
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    const publicOrigin = new URL(origin);
    const target = new URL(request.url);
    return publicOrigin.host === (request.headers.get("host") ?? target.host) && publicOrigin.protocol === target.protocol;
  } catch { return false; }
}
export function parseChatInput(value: unknown): ChatInput {
  if (!record(value) || Object.keys(value).some((key) => !["message", "requestId", "history"].includes(key)) || typeof value.message !== "string" || !value.message.trim() || length(value.message.trim()) > 300 || typeof value.requestId !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value.requestId)) throw new Error("INVALID_INPUT");
  const history = value.history ?? [];
  if (!Array.isArray(history) || history.length > 4 || !history.every((item) => record(item) && Object.keys(item).every((key) => ["role", "content"].includes(key)) && ["user", "assistant"].includes(item.role as string) && typeof item.content === "string" && item.content.trim().length > 0 && length(item.content) <= 1000)) throw new Error("INVALID_HISTORY");
  return { message: value.message.trim(), requestId: value.requestId.toLowerCase(), history };
}

export async function readChatBody(request: Request): Promise<ChatInput> {
  if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json" || !request.body) throw new Error("INVALID_BODY");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const deadline = new Promise<never>((_, reject) => { timer = setTimeout(() => { void reader.cancel(); reject(new Error("BODY_TIMEOUT")); }, 5000); });
  try {
    for (;;) {
      const part = await Promise.race([reader.read(), deadline]);
      if (part.done) break;
      size += part.value.byteLength;
      if (size > 16 * 1024) throw new Error("BODY_TOO_LARGE");
      chunks.push(part.value);
    }
    return parseChatInput(JSON.parse(Buffer.concat(chunks).toString("utf8")));
  } finally {
    clearTimeout(timer);
    await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}
