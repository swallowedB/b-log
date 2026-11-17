import Link from "next/link";
import LearningFolderArt from "@/assets/svg/learning-folder.svg";
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
    <ResumeCard padded={false} accent={false} className={`${styles.folderCard} ${className ?? ""}`} animationDelay={animationDelay}>
      <section aria-label="최근 학습 후기" className={styles.folderStack}>
        <div className={styles.folderVisual}>
          <LearningFolderArt viewBox="0 0 624 380" className={styles.folderArt} aria-hidden="true" focusable="false" data-learning-folder-art />
          <div className={styles.folderTrack}>
            <FolderIndex type="book" />
            <FolderIndex type="conference" />
            <FolderIndex type="course" />
            <div className={styles.folderBody}>
              <div className="flex items-center justify-between gap-2">
                <h2 className={styles.folderTitle}>Learning</h2>
                <Link href="/learning" className={styles.folderBrowse}>전체 보기 ↗</Link>
              </div>
              <p className={styles.folderDescription}>배운 것과 나의 관점, 실제 적용의 기록</p>
              {!entries.length && <p className={styles.folderDescription}>학습 후기를 차곡차곡 정리하고 있습니다.</p>}
            </div>
          </div>
        </div>
        {entries.length > 0 && (
          <div className="space-y-2 px-3 pb-3">
            {entries.map((entry) => <LearningCard key={entry.slug} entry={entry} compact />)}
          </div>
        )}
      </section>
    </ResumeCard>
  );
}
