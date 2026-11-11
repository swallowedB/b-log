"use client";

import { MessageSquare } from "lucide-react";
import { useRef, useState } from "react";
import type { ResumeFAQ } from "@/lib/resume/types";
import { getStaticAnswer } from "@/lib/resume/staticAnswers";
import ResumeCard from "../ResumeCard";
import ChatComposer from "../chat/ChatComposer";
import ChatMessageList, { type ChatMessage } from "../chat/ChatMessageList";
import SuggestedQuestions from "../chat/SuggestedQuestions";
import type { ResumeCardSlotProps } from "./card.types";

export default function AskBoaCard({ faqs, className, animationDelay }: ResumeCardSlotProps & { faqs: readonly ResumeFAQ[] }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [scrollRequest, setScrollRequest] = useState(-1);
  const nextId = useRef(0);
  const suggestions = [...faqs.filter((faq) => faq.id.startsWith("case:")), ...faqs.filter((faq) => !faq.id.startsWith("case:"))].slice(0, 4);
  const submit = (message: string) => {
    const text = message.trim();
    if (!text || Array.from(text).length > 300) return;
    const result = getStaticAnswer(text, faqs);
    const user: ChatMessage = { id: nextId.current++, role: "user", text, sources: [] };
    const assistant: ChatMessage = { id: nextId.current++, role: "assistant", text: result?.answer ?? "자유 질문은 준비 중입니다. 지금은 추천 질문과 공개 사례에서 경험을 살펴보세요.", sources: result?.sources ?? suggestions[0]?.sources ?? [] };
    setMessages((current) => [...current, user, assistant]);
    setScrollRequest(assistant.id);
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
        <SuggestedQuestions faqs={suggestions} onSelect={submit} />
        <ChatComposer onSubmit={submit} />
      </section>
    </ResumeCard>
  );
}
