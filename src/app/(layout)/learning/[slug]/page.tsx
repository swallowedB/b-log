import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PostContent from "@/app/(layout)/posts/[slug]/_components/PostContent";
import { getPublicLearningBySlug, getPublicLearningEntries } from "@/lib/learning/content.server";
import { getPublicSources } from "@/lib/resume/content.server";
import { getLearningReferences } from "@/lib/learning/catalog";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return getPublicLearningEntries().map((entry) => ({ slug: entry.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const entry = getPublicLearningBySlug((await params).slug);
  if (!entry) return {};
  const url = `https://b0o0a.com/learning/${entry.slug}`;
  return { title: entry.title, description: entry.summary, alternates: { canonical: url }, openGraph: { title: entry.title, description: entry.summary, type: "article", url, images: [entry.coverImage ?? "/post-fallback.png"] } };
}
export default async function LearningDetailPage({ params }: Props) {
  const entry = getPublicLearningBySlug((await params).slug);
  if (!entry) notFound();
  const labels = { applied: "실제 적용", planned: "적용 예정", not_applied: "미적용" };
  const references = getLearningReferences(entry, getPublicSources());
  return <main className="mx-auto w-full max-w-3xl px-5 pb-20 pt-24">
    <Link href="/learning" className="text-sm text-blue hover:underline">← Learning</Link>
    <p className="mt-8 text-xs uppercase tracking-widest text-blue">{entry.type} · {entry.publishedAt}</p>
    <h1 className="mt-3 text-3xl font-bold">{entry.title}</h1>
    <ul aria-label="태그" className="mt-3 flex flex-wrap gap-2 text-xs text-blue">{entry.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
    <p className="mt-4 text-sm leading-7 text-foreground/65">{entry.summary}</p>
    <PostContent content={entry.code} />
    <section aria-labelledby="applied-to" className="mt-10 rounded-xl border border-foreground/15 p-5"><h2 id="applied-to" className="font-semibold">Applied To · {labels[entry.appliedTo.status]}</h2><p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-foreground/70">{entry.appliedTo.description || "아직 적용 기록이 없습니다."}</p></section>
    <nav aria-label="References" className="mt-8 flex flex-wrap gap-3 border-t border-foreground/15 pt-6">{references.map((source) => <Link key={source.id} href={source.url} className="rounded-lg border border-blue/20 px-3 py-2 text-sm text-blue hover:bg-blue/10">{source.title} ↗</Link>)}</nav>
  </main>;
}
