import type { Metadata } from "next";
import Link from "next/link";
import { getPublicLearningEntries } from "@/lib/learning/content.server";
import { parseLearningType, selectLearningEntries } from "@/lib/learning/catalog";
import LearningCard from "./_components/LearningCard";
import LearningFilters from "./_components/LearningFilters";

export const metadata: Metadata = { title: "Learning", description: "책, 컨퍼런스, 강의에서 배운 것과 나의 관점, 실제 적용을 기록합니다.", alternates: { canonical: "https://b0o0a.com/learning" }, openGraph: { title: "Learning", url: "https://b0o0a.com/learning", images: ["/post-fallback.png"] } };

export default async function LearningPage({ searchParams }: { searchParams: Promise<{ type?: string | string[] }> }) {
  const type = parseLearningType((await searchParams).type);
  const entries = selectLearningEntries(getPublicLearningEntries(), type);
  return <main className="mx-auto w-full max-w-4xl px-5 pb-20 pt-12">
    <Link href="/resume" className="text-sm text-blue hover:underline">← Resume</Link>
    <h1 className="mt-8 text-3xl font-bold">Learning</h1>
    <p className="mt-4 text-sm leading-7 text-foreground/65">책, 컨퍼런스, 강의에서 배운 것과 나의 관점, 실제 적용을 기록합니다.</p>
    <LearningFilters type={type} />
    {entries.length ? <div className="grid gap-4 sm:grid-cols-2">{entries.map((entry) => <LearningCard key={entry.slug} entry={entry} />)}</div> : <div className="rounded-2xl border border-dashed border-foreground/20 px-6 py-14 text-center"><p className="font-medium">아직 공개된 학습 후기가 없습니다.</p><p className="mt-3 text-sm text-foreground/60">배운 내용과 직접 생각한 점을 정리해 이곳에 모아둘 예정입니다.</p></div>}
  </main>;
}
