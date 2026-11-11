import { getContentVersion, getPublicContextDocuments, getPublicFAQs, getPublicSources } from "@/lib/resume/content.server";
import { handleChat } from "@/lib/resume-chat/handleChat.server";
import { getChatIdentity } from "@/lib/resume-chat/identity.server";
import { isSameOrigin, readChatBody } from "@/lib/resume-chat/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 20;

export async function POST(request: Request): Promise<Response> {
  const headers = { "Cache-Control": "no-store" };
  if (!isSameOrigin(request)) return Response.json({ code: "INVALID_ORIGIN", message: "같은 사이트에서 요청해 주세요.", fallbackSources: [] }, { status: 403, headers });
  let input;
  try { input = await readChatBody(request); }
  catch { return Response.json({ code: "INVALID_INPUT", message: "질문과 대화 형식을 확인해 주세요. 질문은 300자 이내입니다.", fallbackSources: [] }, { status: 400, headers }); }
  const visitor = getChatIdentity(request);
  const result = await handleChat(input, visitor?.identity ?? null, {
    faqs: getPublicFAQs(), documents: getPublicContextDocuments(), sources: getPublicSources(), contentVersion: getContentVersion(), promptVersion: "not-connected", model: "disabled",
    eligible: async () => false, store: null,
    generate: async () => { throw new Error("AI_NOT_CONNECTED"); },
  });
  return Response.json(result, { headers: { ...headers, ...(visitor?.cookie ? { "Set-Cookie": visitor.cookie } : {}) }, status: result.code === "quota" ? 429 : 200 });
}
