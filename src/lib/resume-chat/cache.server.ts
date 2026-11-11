import "server-only";
import { createHash } from "node:crypto";
import { normalizeQuestion } from "@/lib/resume/staticAnswers";
import type { ChatInput } from "./types";

// Only these reviewed, non-personal questions may be persisted. Arbitrary input/history is never cached.
const cacheable = new Set(["COMMA에서 Delta Time을 선택한 이유를 설명해 주세요"].map(normalizeQuestion));
export function answerCacheKey(input: ChatInput, contentVersion: string, promptVersion: string, model: string): string | null {
  const question = normalizeQuestion(input.message);
  return input.history.length === 0 && cacheable.has(question) ? createHash("sha256").update(JSON.stringify({ question, contentVersion, promptVersion, model })).digest("hex") : null;
}
