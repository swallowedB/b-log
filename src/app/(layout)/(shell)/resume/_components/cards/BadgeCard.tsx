import { MousePointer2, NotebookPen, ScanSearch } from "lucide-react";
import Link from "next/link";
import ResumeCard from "../ResumeCard";
import styles from "./ResumeCollections.module.css";
import type { ResumeCardSlotProps } from "./card.types";

const badges = [
  { title: "문제 구조화", href: "/posts/game-delta-time-fps-fix", icon: ScanSearch, tone: "blue" },
  { title: "인터랙션 설계", href: "/posts/react-dock-menu-component", icon: MousePointer2, tone: "violet" },
  { title: "구현 기록", href: "/posts/react-troubleshooting-log", icon: NotebookPen, tone: "gold" },
] as const;

export default function BadgeCard({ className, animationDelay }: ResumeCardSlotProps) {
  return (
    <ResumeCard className={className} animationDelay={animationDelay}>
      <section aria-labelledby="badge-heading" className="flex h-full flex-col">
        <h2 id="badge-heading" className="mb-4 text-xl font-semibold">Badge</h2>
        <ul className="my-auto grid grid-cols-3 gap-2">
          {badges.map(({ title, href, icon: Icon, tone }) => (
            <li key={title}>
              <Link href={href} className={styles.badgeLink} data-tone={tone}>
                <span className={styles.medal} aria-hidden="true"><Icon size={21} strokeWidth={1.8} /></span>
                <span className="text-xs font-semibold [word-break:keep-all] sm:text-sm">{title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </ResumeCard>
  );
}
