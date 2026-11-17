import Link from "next/link";
import LearningFolderArt from "@/assets/svg/learning-folder.svg";
import LearningFolderReflections from "@/assets/svg/learning-folder-reflections.svg";
import LearningCard, { learningLabels, type LearningPreview } from "@/app/(layout)/(shell)/learning/_components/LearningCard";
import type { LearningType } from "@/lib/resume/types";
import ResumeCard from "../ResumeCard";
import styles from "./ResumeCollections.module.css";
import type { ResumeCardSlotProps } from "./card.types";

function FolderIndex({ type }: { type: LearningType }) {
  return <Link href={`/learning?type=${type}`} className={styles.folderIndex} data-type={type}>{learningLabels[type]}</Link>;
}

export default function LearningShelfPreview({ entries, className, animationDelay }: ResumeCardSlotProps & { entries: readonly LearningPreview[] }) {
  return (
    <ResumeCard accent={false} className={`${styles.folderCard} ${className ?? ""}`} animationDelay={animationDelay}>
      <section aria-label="최근 학습 후기" className="flex h-full flex-col gap-1">
        <h2 className="text-xl font-semibold">Learning</h2>
        <div className={styles.folderVisual}>
          <LearningFolderArt viewBox="0 0 624 380" className={styles.folderArt} aria-hidden="true" focusable="false" data-learning-folder-art />
          <LearningFolderReflections className={styles.folderReflections} aria-hidden="true" focusable="false" data-learning-folder-reflections />
          <div className={styles.folderTrack}>
            <FolderIndex type="book" />
            <FolderIndex type="conference" />
            <FolderIndex type="course" />
            <Link
              href="/learning"
              className={`${styles.folderBrowse} inline-flex min-h-8 items-center gap-1 rounded px-2 text-xs font-semibold underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current`}
            >
              전체 보기 <span aria-hidden>↗</span>
            </Link>
          </div>
        </div>
        {entries.length > 0 && (
          <div className="space-y-2 pb-3">
            {entries.map((entry) => <LearningCard key={entry.slug} entry={entry} compact />)}
          </div>
        )}
      </section>
    </ResumeCard>
  );
}
