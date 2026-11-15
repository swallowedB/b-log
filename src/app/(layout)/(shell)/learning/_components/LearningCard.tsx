import Image from "next/image";
import Link from "next/link";
import { BookOpen, GraduationCap, Mic } from "lucide-react";
import type { LearningEntry } from "@/lib/resume/types";

export type LearningPreview = Pick<LearningEntry, "slug" | "title" | "summary" | "type" | "publishedAt" | "tags" | "coverImage">;
export const learningLabels = { book: "Book", conference: "Conference", course: "Course" };
const icons = { book: BookOpen, conference: Mic, course: GraduationCap };

export default function LearningCard({ entry, compact = false }: { entry: LearningPreview; compact?: boolean }) {
  const Icon = icons[entry.type];
  return (
    <Link href={`/learning/${entry.slug}`} className={`group flex gap-3 rounded-xl border border-foreground/10 bg-foreground/[0.025] transition hover:border-blue/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue ${compact ? "p-3" : "p-5"}`}>
      {entry.coverImage ? <Image src={entry.coverImage} alt="" width={48} height={64} className="h-16 w-12 shrink-0 rounded object-cover" /> : <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue/10 text-blue"><Icon size={20} aria-hidden /></span>}
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-blue">{learningLabels[entry.type]}</p>
        <h2 className={`mt-1 font-semibold group-hover:text-blue ${compact ? "text-xs" : "text-lg"}`}>{entry.title}</h2>
        <p className={`mt-2 leading-relaxed text-foreground/65 ${compact ? "line-clamp-2 text-[11px]" : "text-sm"}`}>{entry.summary}</p>
        {!compact && <p className="mt-3 text-xs text-foreground/50">{entry.publishedAt} {entry.tags.map((tag) => `· ${tag}`).join(" ")}</p>}
      </div>
    </Link>
  );
}
