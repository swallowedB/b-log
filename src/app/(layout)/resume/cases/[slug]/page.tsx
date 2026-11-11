import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PostContent from "@/app/(layout)/posts/[slug]/_components/PostContent";
import { getPublicCaseBySlug, getPublicCases, getPublicSources } from "@/lib/resume/content.server";
import { getCaseReferences } from "@/lib/resume/catalog";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;

export function generateStaticParams() {
  return getPublicCases().map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const entry = getPublicCaseBySlug((await params).slug);
  if (!entry) return {};
  const url = `https://b0o0a.com/resume/cases/${entry.slug}`;
  return { title: entry.title, description: entry.summary, alternates: { canonical: url }, openGraph: { title: entry.title, description: entry.summary, type: "article", url, images: ["/post-fallback.png"] } };
}

export default async function CasePage({ params }: Props) {
  const entry = getPublicCaseBySlug((await params).slug);
  if (!entry) notFound();
  const sources = getCaseReferences(entry, getPublicSources());
  return (
    <main className="mx-auto w-full max-w-3xl px-5 pb-20 pt-24">
      <Link href="/resume" className="text-sm text-blue hover:underline">← Resume</Link>
      <p className="mt-8 text-xs font-semibold uppercase tracking-widest text-blue">Engineering Case</p>
      <h1 className="mt-3 text-3xl font-bold leading-tight">{entry.title}</h1>
      <p className="mt-4 text-sm leading-7 text-foreground/65">{entry.summary}</p>
      <p className="mt-3 text-xs text-foreground/50">{entry.publishedAt} · {entry.tags.join(" · ")}</p>
      <PostContent content={entry.code} />
      <nav aria-label="관련 근거" className="mt-10 flex flex-wrap gap-3 border-t border-foreground/15 pt-6">
        {sources.map((source) => <Link key={source.id} href={source.url} className="rounded-lg border border-blue/20 px-3 py-2 text-sm text-blue hover:bg-blue/10">{source.title} ↗</Link>)}
      </nav>
    </main>
  );
}
