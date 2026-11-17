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
    <ResumeCard className={className} animationDelay={animationDelay}>
      <section aria-label="최근 학습 후기" className="flex h-full flex-col gap-1">
        <h2 className="text-xl font-semibold">Learning</h2>
        <div className={styles.folderVisual}>
          <LearningFolderArt viewBox="0 0 624 380" className={styles.folderArt} aria-hidden="true" focusable="false" data-learning-folder-art />
          <LearningFolderReflections className={styles.folderReflections} aria-hidden="true" focusable="false" data-learning-folder-reflections />
          <div className={styles.folderTrack}>
            <FolderIndex type="book" />
            <FolderIndex type="conference" />
            <FolderIndex type="course" />
          </div>
        </div>
        {entries.length > 0 && (
          <div className="space-y-2 pb-3">
            {entries.map((entry) => <LearningCard key={entry.slug} entry={entry} compact />)}
          </div>
        )}
        <Link
          href="/learning"
          className={`${styles.folderBrowse} mt-auto self-end rounded-full border border-folder-blue/25 bg-folder-blue/8 px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-folder-blue/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-folder-blue`}
        >
          전체 보기 <span aria-hidden>↗</span>
        </Link>
      </section>
    </ResumeCard>
  );
}
