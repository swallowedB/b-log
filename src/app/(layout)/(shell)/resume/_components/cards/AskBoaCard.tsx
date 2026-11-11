"use client";

import { MessageSquare } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ResumeFAQ } from "@/lib/resume/types";
import { getStaticAnswer } from "@/lib/resume/staticAnswers";
import ResumeCard from "../ResumeCard";
import ChatComposer from "../chat/ChatComposer";
import ChatMessageList, { type ChatMessage } from "../chat/ChatMessageList";
import SuggestedQuestions from "../chat/SuggestedQuestions";
import type { ResumeCardSlotProps } from "./card.types";
import type { ChatInput, ChatResult } from "@/lib/resume-chat/types";

export default function AskBoaCard({ faqs, className, animationDelay }: ResumeCardSlotProps & { faqs: readonly ResumeFAQ[] }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [scrollRequest, setScrollRequest] = useState(-1);
  const nextId = useRef(0);
  const sending = useRef(false);
  const controller = useRef<AbortController | null>(null);
  const [pending, setPending] = useState(false);
  const [retry, setRetry] = useState<ChatInput | null>(null);
  const [quota, setQuota] = useState<{ remaining?: number; resetAt?: string }>({});
  useEffect(() => () => { const active = controller.current; controller.current = null; active?.abort(); }, []);
  const suggestions = [...faqs.filter((faq) => faq.id.startsWith("case:")), ...faqs.filter((faq) => !faq.id.startsWith("case:"))].slice(0, 4);
  const sendFree = async (input: ChatInput) => {
    if (sending.current) return;
    sending.current = true; setPending(true); setRetry(null);
    const abort = new AbortController(); controller.current = abort;
    const timer = setTimeout(() => abort.abort(), 25000);
    try {
      const response = await fetch("/api/resume/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input), signal: abort.signal });
      const result = await response.json() as ChatResult;
      if (controller.current !== abort) return;
      if ((!response.ok && response.status !== 429) || typeof result.answer !== "string" || !Array.isArray(result.sources) || !["static", "cache", "ai", "fallback"].includes(result.mode)) throw new Error("INVALID_RESPONSE");
      setMessages((current) => [...current, { id: nextId.current++, role: "assistant", text: result.answer, sources: result.sources, mode: result.mode }]);
      setQuota({ remaining: result.remaining, resetAt: result.resetAt });
    } catch { if (controller.current === abort) setRetry(input); }
    finally { clearTimeout(timer); sending.current = false; if (controller.current === abort) { controller.current = null; setPending(false); } }
  };
  const submit = (message: string) => {
    if (sending.current) return;
    const text = message.trim();
    if (!text || Array.from(text).length > 300) return;
    const result = getStaticAnswer(text, faqs);
    const user: ChatMessage = { id: nextId.current++, role: "user", text, sources: [] };
    setRetry(null);
    if (result) {
      const assistant: ChatMessage = { id: nextId.current++, role: "assistant", text: result.answer, sources: result.sources };
      setMessages((current) => [...current, user, assistant]); setScrollRequest(assistant.id);
    } else {
      const history = messages.filter((item) => item.mode !== "fallback").slice(-4).map((item) => ({ role: item.role, content: Array.from(item.text).slice(0, 1000).join("") }));
      setMessages((current) => [...current, user]); setScrollRequest(user.id);
      void sendFree({ message: text, history, requestId: crypto.randomUUID() });
    }
  };
  return (
    <ResumeCard padded={false} accent={false} className={className} animationDelay={animationDelay}>
      <section id="ask-boa" aria-label="Ask Boa" className="flex h-full min-h-0 flex-col overflow-hidden">
        <header className="flex items-start gap-3 border-b border-foreground/10 bg-blue/5 px-4 py-3">
          <span className="rounded-lg border border-blue/20 bg-blue/10 p-2 text-blue"><MessageSquare aria-hidden className="size-4" /></span>
          <div className="min-w-0 flex-1"><h2 className="text-sm font-semibold">Ask Boa</h2><p className="mt-1 text-[10px] leading-4 text-foreground/50">Explore how I think, build, and solve problems.</p></div>
          <span className="shrink-0 rounded-full border border-blue/20 px-2 py-1 text-[9px] text-blue">경험 탐색</span>
        </header>
        <ChatMessageList messages={messages} scrollRequest={scrollRequest} />
        {pending && <p role="status" className="px-4 py-2 text-xs text-blue">공개 자료를 확인하고 있어요…</p>}
        {retry && <div role="alert" className="flex items-center justify-between gap-2 px-4 py-2 text-xs text-foreground/70"><span>연결을 확인하지 못했어요.</span><button type="button" className="shrink-0 text-blue underline" onClick={() => { setScrollRequest(nextId.current++); void sendFree(retry); }}>다시 확인</button></div>}
        {quota.remaining !== undefined && <p className="px-4 py-1 text-[10px] text-foreground/55">오늘 자유 질문 {quota.remaining}회 남음{quota.resetAt ? ` · 다음 이용 기준 ${new Date(quota.resetAt).toLocaleString("ko-KR", { timeZone: "UTC" })} UTC` : ""}</p>}
        <SuggestedQuestions faqs={suggestions} onSelect={submit} disabled={pending} />
        <ChatComposer onSubmit={submit} disabled={pending} />
      </section>
    </ResumeCard>
  );
}
