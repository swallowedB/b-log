import Link from "next/link";
import LearningCard, { type LearningPreview } from "@/app/(layout)/(shell)/learning/_components/LearningCard";
import ResumeCard from "../ResumeCard";
import type { ResumeCardSlotProps } from "./card.types";

export default function LearningShelfPreview({ entries, className, animationDelay }: ResumeCardSlotProps & { entries: readonly LearningPreview[] }) {
  return <ResumeCard title="Learning" className={className} animationDelay={animationDelay}>
    <section aria-label="최근 학습 후기" className="flex h-full min-h-0 flex-col gap-3">
      <p className="text-[11px] leading-relaxed text-foreground/60">배운 것과 나의 관점, 실제 적용의 기록</p>
      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto">{entries.length ? entries.slice(0, 3).map((entry) => <LearningCard key={entry.slug} entry={entry} compact />) : <p className="flex h-full min-h-20 items-center rounded-xl border border-dashed border-foreground/15 p-4 text-xs leading-relaxed text-foreground/55">학습 후기를 차곡차곡 정리하고 있습니다.</p>}</div>
      <Link href="/learning" className="self-start text-xs font-medium text-blue hover:underline">전체 보기 ↗</Link>
    </section>
  </ResumeCard>;
}
