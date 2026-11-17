import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { CaseFile } from "@/lib/resume/types";
import ResumeCard from "../ResumeCard";
import styles from "./ResumeCollections.module.css";
import type { ResumeCardSlotProps } from "./card.types";

export type ActivityCasePreview = Pick<CaseFile, "slug" | "title" | "summary"> & { projectName: string };

export default function ActivityCasesCard({ entries, className, animationDelay }: ResumeCardSlotProps & {
  entries: readonly ActivityCasePreview[];
}) {
  return (
    <ResumeCard className={className} animationDelay={animationDelay}>
      <section id="project" aria-labelledby="activity-case-heading" className="flex h-full flex-col gap-4 scroll-mt-24">
        <h2 id="activity-case-heading" className="text-xl font-semibold">Activity Case</h2>
        {entries.length ? (
          <ul className="my-auto space-y-3 py-1">
            {entries.map((entry) => (
              <li key={entry.slug}>
                <Link href={`/resume/cases/${entry.slug}`} className={styles.recordLink}>
                  <span className={styles.recordStage} aria-hidden="true">
                    <span className={styles.disc} data-record-disc />
                    <span className={styles.sleeve} data-record-sleeve>
                      <span>{entry.projectName}</span>
                    </span>
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-sky-800 dark:text-sky-300">{entry.projectName}</p>
                    <h3 className="mt-1 text-sm leading-snug font-semibold [word-break:keep-all] sm:text-base">{entry.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-foreground/70 [word-break:keep-all]">{entry.summary}</p>
                  </div>
                  <ArrowUpRight className={styles.caseArrow} size={16} aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        ) : <p className="text-sm text-foreground/65">아직 공개된 활동 사례가 없습니다.</p>}
      </section>
    </ResumeCard>
  );
}
