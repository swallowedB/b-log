import { shelfSection } from "../../_constants/resume.data";
import ResumeCard from "../ResumeCard";
import type { ResumeCardSlotProps } from "./card.types";

export default function ShelfCard({ className, animationDelay }: ResumeCardSlotProps) {
  return (
    <ResumeCard title={shelfSection.title} animationDelay={animationDelay} className={className}>
      <section
        id="shelf"
        className="flex h-full items-center justify-center scroll-mt-24 rounded-[18px] border border-dashed border-slate-300/90 bg-slate-50/70 dark:border-white/14 dark:bg-white/[0.025]"
      >
        <p className="px-4 text-center text-[12px] font-medium text-foreground/48">
          Shelf will be added here
        </p>
      </section>
    </ResumeCard>
  );
}
