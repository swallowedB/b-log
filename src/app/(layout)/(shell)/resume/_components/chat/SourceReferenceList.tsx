import Link from "next/link";
import type { ResumeSource } from "@/lib/resume/types";

export default function SourceReferenceList({ sources }: { sources: readonly ResumeSource[] }) {
  if (!sources.length) return null;
  return (
    <nav aria-label="답변 근거" className="mt-3 flex flex-wrap gap-2">
      {sources.map((source) => <Link key={source.id} href={source.url} className="max-w-full rounded-md border border-blue/25 bg-blue/5 px-2 py-1 text-[11px] text-blue transition hover:bg-blue/15 focus-visible:outline-2 focus-visible:outline-blue">{source.title}</Link>)}
    </nav>
  );
}
