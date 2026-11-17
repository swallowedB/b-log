import type { ResumeFAQ } from "@/lib/resume/types";

export default function SuggestedQuestions({ faqs, onSelect, disabled = false }: { faqs: readonly ResumeFAQ[]; onSelect: (message: string) => void; disabled?: boolean }) {
  return (
    <div aria-label="추천 질문" className="flex max-h-[24dvh] shrink-0 flex-wrap gap-2 overflow-y-auto overscroll-contain border-t border-foreground/8 px-4 py-3">
      {faqs.map((faq) => <button disabled={disabled} type="button" key={faq.id} onClick={() => onSelect(faq.question)} className="max-w-full rounded-lg border border-blue/20 bg-blue/5 px-2.5 py-1.5 text-left text-xs leading-5 text-foreground/80 transition hover:border-blue/50 hover:text-blue focus-visible:outline-2 focus-visible:outline-blue disabled:opacity-45">{faq.question}</button>)}
    </div>
  );
}
