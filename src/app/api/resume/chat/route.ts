import { getContentVersion, getPublicContextDocuments, getPublicFAQs, getPublicSources } from "@/lib/resume/content.server";
import { handleChat } from "@/lib/resume-chat/handleChat.server";
import { getChatIdentity } from "@/lib/resume-chat/identity.server";
import { isSameOrigin, readChatBody } from "@/lib/resume-chat/validation";
import { createGeminiAnswerer } from "@/lib/resume-chat/geminiClient.server";
import { createChatStore } from "@/lib/resume-chat/quota.server";
import { FREE_MODEL } from "@/lib/resume-chat/freeTierGuard.server";
import { PROMPT_VERSION } from "@/lib/resume-chat/prompt.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(request: Request): Promise<Response> {
  const headers = { "Cache-Control": "no-store" };
  if (!isSameOrigin(request)) return Response.json({ code: "INVALID_ORIGIN", message: "같은 사이트에서 요청해 주세요.", fallbackSources: [] }, { status: 403, headers });
  let input;
  try { input = await readChatBody(request); }
  catch { return Response.json({ code: "INVALID_INPUT", message: "질문과 대화 형식을 확인해 주세요. 질문은 300자 이내입니다.", fallbackSources: [] }, { status: 400, headers }); }
  const visitor = getChatIdentity(request);
  const gemini = createGeminiAnswerer();
  const result = await handleChat(input, visitor?.identity ?? null, {
    faqs: getPublicFAQs(), documents: getPublicContextDocuments(), sources: getPublicSources(), contentVersion: getContentVersion(), promptVersion: PROMPT_VERSION, model: FREE_MODEL,
    eligible: gemini?.eligible ?? (async () => false), store: gemini ? createChatStore() : null,
    generate: gemini ? (input) => gemini.generate({ ...input, signal: request.signal }) : async () => { throw new Error("AI_NOT_CONNECTED"); },
  });
  return Response.json(result, { headers: { ...headers, ...(visitor?.cookie ? { "Set-Cookie": visitor.cookie } : {}) }, status: result.code === "quota" ? 429 : 200 });
}
