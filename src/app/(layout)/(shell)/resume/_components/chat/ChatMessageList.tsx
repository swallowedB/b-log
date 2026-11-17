"use client";

import { useEffect, useRef } from "react";
import type { ResumeSource } from "@/lib/resume/types";
import SourceReferenceList from "./SourceReferenceList";

export type ChatMessage = { id: number; role: "user" | "assistant"; text: string; sources: ResumeSource[]; mode?: "static" | "cache" | "ai" | "fallback" };

export default function ChatMessageList({ messages, scrollRequest }: { messages: readonly ChatMessage[]; scrollRequest: number }) {
  const container = useRef<HTMLDivElement>(null);
  const nearBottom = useRef(true);
  const lastRequest = useRef<number | null>(null);
  useEffect(() => {
    const element = container.current;
    const submitted = lastRequest.current !== scrollRequest;
    lastRequest.current = scrollRequest;
    if (element && (submitted || nearBottom.current) && element.lastElementChild instanceof HTMLElement) {
      element.scrollTop = element.lastElementChild.offsetTop;
    }
  }, [messages, scrollRequest]);
  return (
    <div ref={container} role="log" aria-label="대화 내용" aria-live="polite" aria-relevant="additions" onScroll={() => {
      const element = container.current;
      if (element) nearBottom.current = element.scrollHeight - element.scrollTop - element.clientHeight < 40;
    }} className="relative min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-4">
      {!messages.length && <div className="rounded-xl border border-blue/15 bg-blue/5 p-3 text-xs leading-6 text-foreground/75"><p className="mb-1 font-semibold text-blue">안녕하세요, Boa입니다.</p><p>프로젝트에서 어떤 문제를 해결하고 무엇을 중요하게 생각하는지 살펴보세요. 추천 질문을 누르면 준비한 답변과 근거를 바로 볼 수 있어요.</p></div>}
      {messages.map((message) => <article key={message.id} className={message.role === "user" ? "ml-8 rounded-xl bg-blue/12 p-3" : "mr-2 rounded-xl border border-foreground/10 bg-foreground/[0.025] p-3"}>
        <p className="mb-1 text-[10px] font-semibold text-foreground/45">{message.role === "user" ? "나" : message.mode === "ai" ? "Boa · AI가 작성한 답변" : message.mode === "cache" ? "Boa · AI 답변 (저장됨)" : message.mode === "fallback" ? "Boa · 안내" : "Boa · 준비된 답변"}</p>
        <p className="whitespace-pre-wrap break-words text-xs leading-6 text-foreground/85">{message.text}</p>
        <SourceReferenceList sources={message.sources} />
      </article>)}
    </div>
  );
}
