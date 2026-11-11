"use client";

import { Send } from "lucide-react";
import { useRef, useState } from "react";

export default function ChatComposer({ onSubmit, disabled = false }: { onSubmit: (message: string) => void; disabled?: boolean }) {
  const [value, setValue] = useState("");
  const composing = useRef(false);
  const count = Array.from(value).length;
  const valid = value.trim().length > 0 && count <= 300;
  const submit = () => {
    if (!valid || disabled || composing.current) return;
    onSubmit(value.trim());
    setValue("");
  };
  return (
    <form onSubmit={(event) => { event.preventDefault(); submit(); }} className="border-t border-foreground/10 bg-foreground/[0.02] px-4 pb-3 pt-3">
      <div className="flex items-end gap-2 rounded-lg border border-foreground/15 bg-background/60 px-3 py-2 focus-within:border-blue/60">
        <textarea disabled={disabled} aria-label="Boa에게 질문" aria-describedby="chat-input-help chat-privacy-help" rows={2} value={value} onChange={(event) => setValue(event.target.value)} onCompositionStart={() => { composing.current = true; }} onCompositionEnd={() => { composing.current = false; }} onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing && event.nativeEvent.keyCode !== 229 && !composing.current) {
            event.preventDefault(); submit();
          }
        }} placeholder="Boa의 경험에 대해 물어보세요" className="max-h-28 min-w-0 flex-1 resize-none bg-transparent text-xs leading-6 text-foreground outline-none placeholder:text-foreground/40" />
        <button aria-label="질문 보내기" type="submit" disabled={!valid || disabled} className="mb-1 rounded-lg bg-blue p-2 text-white transition hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue disabled:cursor-not-allowed disabled:opacity-35"><Send aria-hidden className="size-3.5" /></button>
      </div>
      <p id="chat-privacy-help" className="mt-1 text-[10px] text-foreground/45">개인정보나 비밀 정보는 입력하지 마세요.</p>
      <div id="chat-input-help" className="mt-2 flex justify-between gap-3 text-[10px] text-foreground/45">
        <span>{count > 300 ? "300자 이내로 입력해 주세요." : "Enter 전송 · Shift+Enter 줄바꿈"}</span><span>{count}/300</span>
      </div>
    </form>
  );
}
