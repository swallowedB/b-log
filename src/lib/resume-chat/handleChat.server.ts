import "server-only";
import { createHash } from "node:crypto";
import { getStaticAnswer } from "@/lib/resume/staticAnswers";
import { answerCacheKey } from "./cache.server";
import { retrievePublishedContext } from "./retrieveContext.server";
import { parseModelOutput } from "./modelOutput";
import type { ChatDependencies, ChatIdentity, ChatInput, ChatResult, Reservation } from "./types";

export async function handleChat(input: ChatInput, identity: ChatIdentity | null, deps: ChatDependencies): Promise<ChatResult> {
  const staticAnswer = getStaticAnswer(input.message, deps.faqs);
  if (staticAnswer) return { mode: "static", ...staticAnswer };
  const context = retrievePublishedContext(input.message, deps.documents);
  const allowed = [...new Set(context.flatMap((document) => document.sourceIds))];
  const sources = deps.sources.filter((source) => allowed.includes(source.id));
  const fallback = (code: string, quota = {}): ChatResult => ({ mode: "fallback", code, answer: code === "quota" ? "지금은 자유 질문 이용 한도에 도달했어요. 추천 질문과 공개 자료는 계속 볼 수 있습니다." : code === "no_context" ? "공개 자료에서 이 질문의 근거를 찾지 못했어요. 추천 질문과 사례를 살펴보세요." : "지금은 자유 질문 답변을 제공하기 어려워요. 추천 질문과 공개 사례를 이용해 주세요.", sources: sources.slice(0, 3), ...quota });
  if (!context.length || !sources.length) return fallback("no_context");
  const key = answerCacheKey(input, deps.contentVersion, deps.promptVersion, deps.model);
  if (key && deps.store) {
    try {
      const cached = await deps.store.readCache(key);
      if (cached && parseModelOutput({ status: "answered", ...cached }, allowed)) return { mode: "cache", answer: cached.answer, sources: sources.filter((source) => cached.sourceIds.includes(source.id)) };
    } catch { return fallback("storage_unavailable"); }
  }
  if (!identity || !deps.store) return fallback("unavailable");
  try { if (!await deps.eligible()) return fallback("ai_disabled"); } catch { return fallback("eligibility_failed"); }
  const reservation: Reservation = { ...identity, requestId: input.requestId, inputHash: createHash("sha256").update(JSON.stringify({ message: input.message, history: input.history, contentVersion: deps.contentVersion, promptVersion: deps.promptVersion, model: deps.model })).digest("hex") };
  let quota;
  try { quota = await deps.store.reserve(reservation); } catch { return fallback("storage_unavailable"); }
  if (!quota.allowed) return fallback(quota.code ?? "quota", { remaining: quota.remaining, resetAt: quota.resetAt });
  let success = false;
  try {
    const output = parseModelOutput(await deps.generate({ message: input.message, history: input.history, context }), allowed);
    if (!output || output.status !== "answered") return fallback(output?.status ?? "invalid_output", { remaining: quota.remaining, resetAt: quota.resetAt });
    success = true;
    if (key) await deps.store.writeCache(key, { answer: output.answer, sourceIds: output.sourceIds }).catch(() => {});
    return { mode: "ai", answer: output.answer, sources: sources.filter((source) => output.sourceIds.includes(source.id)), remaining: quota.remaining, resetAt: quota.resetAt };
  } catch { return fallback("provider_unavailable", { remaining: quota.remaining, resetAt: quota.resetAt }); }
  finally { await deps.store.finish(reservation, success ? "completed" : "failed").catch(() => {}); }
}
