"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { MessageSquare, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ResumeFAQ } from "@/lib/resume/types";
import { getStaticAnswer } from "@/lib/resume/staticAnswers";
import type { ChatInput, ChatResult } from "@/lib/resume-chat/types";
import ChatComposer from "./ChatComposer";
import ChatMessageList, { type ChatMessage } from "./ChatMessageList";
import SuggestedQuestions from "./SuggestedQuestions";

export default function AskBoa({ faqs }: { faqs: readonly ResumeFAQ[] }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
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
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="fixed right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))] z-[55] inline-flex min-h-12 cursor-pointer items-center gap-2.5 rounded-full border border-white/20 bg-sky-800 px-4 text-sm font-semibold text-white shadow-lg shadow-sky-950/25 transition-colors hover:bg-sky-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue sm:right-6 sm:bottom-6 dark:border-blue/30 dark:bg-sky-300 dark:text-slate-950 dark:hover:bg-sky-200"
        >
          <MessageSquare aria-hidden className="size-[18px]" />
          Ask Boa
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-60 bg-slate-950/25 sm:bg-slate-950/15" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-x-2.5 bottom-[max(0.625rem,env(safe-area-inset-bottom))] z-[65] flex h-[min(40rem,calc(100dvh-1.25rem-env(safe-area-inset-bottom)))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-background text-foreground shadow-2xl shadow-slate-950/25 sm:right-6 sm:bottom-6 sm:left-auto sm:w-[27rem] sm:max-h-[calc(100dvh-3rem)] dark:border-white/15"
        >
          <header className="flex shrink-0 items-center gap-3 border-b border-foreground/10 bg-blue/5 px-4 py-2.5">
            <span className="rounded-lg bg-blue/12 p-2 text-blue"><MessageSquare aria-hidden className="size-4" /></span>
            <Dialog.Title className="flex-1 text-base font-semibold">Ask Boa</Dialog.Title>
            <Dialog.Close asChild>
              <button type="button" aria-label="Ask Boa 닫기" className="grid size-10 cursor-pointer place-items-center rounded-lg text-foreground/65 hover:bg-foreground/8 hover:text-foreground focus-visible:outline-2 focus-visible:outline-blue">
                <X aria-hidden className="size-5" />
              </button>
            </Dialog.Close>
          </header>
          <ChatMessageList messages={messages} scrollRequest={scrollRequest} onSourceNavigate={() => setOpen(false)} />
          {pending && <p role="status" className="shrink-0 px-4 py-2 text-xs text-blue">공개 자료를 확인하고 있어요…</p>}
          {retry && <div role="alert" className="flex shrink-0 items-center justify-between gap-2 px-4 py-2 text-xs text-foreground/70"><span>연결을 확인하지 못했어요.</span><button type="button" className="shrink-0 text-blue underline" onClick={() => { setScrollRequest(nextId.current++); void sendFree(retry); }}>다시 확인</button></div>}
          {quota.remaining !== undefined && <p className="shrink-0 px-4 py-1 text-xs text-foreground/65">오늘 자유 질문 {quota.remaining}회 남음{quota.resetAt ? ` · 다음 이용 기준 ${new Date(quota.resetAt).toLocaleString("ko-KR", { timeZone: "UTC" })} UTC` : ""}</p>}
          <SuggestedQuestions faqs={suggestions} onSelect={submit} disabled={pending} />
          <ChatComposer value={draft} onChange={setDraft} onSubmit={submit} disabled={pending} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
