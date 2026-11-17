import Link from "next/link";
import LearningCard, { type LearningPreview } from "@/app/(layout)/(shell)/learning/_components/LearningCard";
import ResumeCard from "../ResumeCard";
import styles from "./ResumeCollections.module.css";
import type { ResumeCardSlotProps } from "./card.types";

export default function LearningShelfPreview({ entries, className, animationDelay }: ResumeCardSlotProps & { entries: readonly LearningPreview[] }) {
  return (
    <ResumeCard padded={false} accent={false} className={`${styles.folderCard} ${className ?? ""}`} animationDelay={animationDelay}>
      <section aria-label="최근 학습 후기" className={styles.folderStack}>
        <span className={`${styles.folderLayer} ${styles.folderBack}`} aria-hidden="true" />
        <span className={`${styles.folderLayer} ${styles.folderMiddle}`} aria-hidden="true" />
        <div className={`${styles.folderLayer} ${styles.folderFront}`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-2xl font-semibold tracking-tight">Learning</h2>
            <Link href="/learning" className="rounded-full border border-sky-700/20 bg-background/55 px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-sky-900 transition-colors hover:bg-background focus-visible:outline-2 focus-visible:outline-blue dark:border-sky-300/25 dark:text-sky-100">전체 보기 ↗</Link>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-foreground/75">배운 것과 나의 관점, 실제 적용의 기록</p>
          <div className="mt-3 space-y-2">
            {entries.length ? entries.map((entry) => <LearningCard key={entry.slug} entry={entry} compact />) : (
              <p className="border-t border-sky-700/15 pt-3 text-xs leading-relaxed text-foreground/70 dark:border-sky-300/20">학습 후기를 차곡차곡 정리하고 있습니다.</p>
            )}
          </div>
        </div>
      </section>
    </ResumeCard>
  );
}
