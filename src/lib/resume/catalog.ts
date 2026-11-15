import { createHash } from "node:crypto";
import type { CaseFile, ContextDocument, LearningEntry, ResumeFAQ, ResumeSource } from "./types";
import { getLearningReferences, selectLearningEntries, validateLearningEntries } from "@/lib/learning/catalog";

type CatalogInput = {
  cases: readonly CaseFile[];
  posts: readonly { slug: string; title: string; draft: boolean }[];
  projects: readonly { id: string; title: string; githubUrl: string }[];
  baseFAQs?: readonly ResumeFAQ[];
  learning?: readonly LearningEntry[];
};

export function getCaseReferences(entry: CaseFile, sources: readonly ResumeSource[]): ResumeSource[] {
  const ids = [
    ...entry.evidenceLinks.map((_, index) => `evidence:${entry.slug}:${index}`),
    ...entry.relatedPostSlugs.map((slug) => `post:${slug}`),
    ...entry.relatedLearningSlugs.map((slug) => `learning:${slug}`),
    `project:${entry.projectId}`,
  ];
  return ids.map((id) => sources.find((source) => source.id === id)).filter((source): source is ResumeSource => Boolean(source));
}

export function validateCases({ cases, posts, projects, learning = [] }: CatalogInput): void {
  const slugs = new Set<string>();
  for (const entry of cases) {
    if (slugs.has(entry.slug)) throw new Error(`Duplicate case slug: ${entry.slug}`);
    slugs.add(entry.slug);
    if (!projects.some((project) => project.id === entry.projectId)) throw new Error(`Unknown project: ${entry.projectId}`);
    for (const slug of entry.relatedPostSlugs) {
      const post = posts.find((item) => item.slug === slug);
      if (!post || (entry.published && post.draft)) throw new Error(`Invalid post reference: ${slug}`);
    }
    for (const slug of entry.relatedLearningSlugs) {
      const item = learning.find((item) => item.slug === slug);
      if (!item || (entry.published && !item.published)) throw new Error(`Invalid learning reference: ${slug}`);
    }
    for (const heading of ["Problem", "Context", "Analysis", "Decision", "Action", "Result", "Insight"]) {
      if (!new RegExp(`^## ${heading}\\s*$`, "m").test(entry.raw)) throw new Error(`Missing case section: ${heading}`);
    }
    for (const link of entry.evidenceLinks) {
      if (new URL(link.url).protocol !== "https:") throw new Error(`Evidence must use HTTPS: ${entry.slug}`);
    }
  }
}

export function buildResumeCatalog(input: CatalogInput) {
  validateCases(input);
  validateLearningEntries({ ...input, learning: input.learning ?? [] });
  const learning = selectLearningEntries(input.learning ?? []);
  const cases = input.cases.filter((entry) => entry.published).map((entry) => ({ ...entry, relatedLearningSlugs: [...new Set([...entry.relatedLearningSlugs, ...learning.filter((item) => item.appliedTo.relatedCaseIds.includes(`case:${entry.slug}`)).map((item) => item.slug)])] })).sort((a, b) => Number(b.featured) - Number(a.featured) || b.publishedAt.localeCompare(a.publishedAt) || a.slug.localeCompare(b.slug));
  const sources: ResumeSource[] = [
    ...input.projects.map((entry): ResumeSource => ({ id: `project:${entry.id}`, type: "project", title: entry.title, url: entry.githubUrl })),
    ...input.posts.filter((entry) => !entry.draft).map((entry): ResumeSource => ({ id: `post:${entry.slug}`, type: "post", title: entry.title, url: `/posts/${entry.slug}` })),
    ...cases.map((entry): ResumeSource => ({ id: `case:${entry.slug}`, type: "case", title: entry.title, url: `/resume/cases/${entry.slug}` })),
    ...learning.flatMap((entry): ResumeSource[] => [
      { id: `learning:${entry.slug}`, type: "learning", title: entry.title, url: `/learning/${entry.slug}` },
      ...(entry.originalUrl ? [{ id: `learning-original:${entry.slug}`, type: "learning" as const, title: entry.publisherOrOrganizer ?? "원본 자료", url: entry.originalUrl }] : []),
      ...entry.appliedTo.evidenceLinks.map((link, index): ResumeSource => ({ id: `learning-evidence:${entry.slug}:${index}`, type: "learning", ...link })),
    ]),
    ...(input.baseFAQs ?? []).flatMap((faq) => faq.sources),
  ];
  for (const entry of cases) {
    sources.push(...entry.evidenceLinks.map((link, index): ResumeSource => ({ id: `evidence:${entry.slug}:${index}`, type: "case", ...link })));
  }
  const uniqueSources = [...new Map(sources.map((source) => [source.id, source])).values()];
  const caseSources = (entry: CaseFile) => [
    uniqueSources.find((source) => source.id === `case:${entry.slug}`)!,
    ...getCaseReferences(entry, uniqueSources),
  ];
  const faqs: ResumeFAQ[] = [
    ...(input.baseFAQs ?? []),
    ...cases.flatMap((entry): ResumeFAQ[] => entry.chat ? [{ id: `case:${entry.slug}`, ...entry.chat, sources: caseSources(entry).slice(0, 3) }] : []),
  ];
  const context: ContextDocument[] = [
    ...(input.baseFAQs ?? []).map((faq) => ({ id: faq.id, title: faq.question, text: faq.answer, tags: ["Resume"], keywords: faq.aliases, sourceIds: faq.sources.map((source) => source.id) })),
    ...cases.map((entry) => ({ id: `case:${entry.slug}`, title: entry.title, text: entry.contextText, tags: entry.tags, keywords: entry.keywords, sourceIds: caseSources(entry).map((source) => source.id) })),
    ...learning.map((entry) => ({ id: `learning:${entry.slug}`, title: entry.title, text: `유형: ${entry.type}\n적용 상태: ${entry.appliedTo.status}\n${entry.appliedTo.description}\n${entry.contextText}`, tags: entry.tags, keywords: [entry.type, ...entry.tags], sourceIds: [`learning:${entry.slug}`, ...getLearningReferences(entry, uniqueSources).map((source) => source.id)] })),
  ];
  const version = createHash("sha256").update(JSON.stringify({ cases, learning, faqs, sources: uniqueSources, context })).digest("hex");
  return { cases, learning, faqs, context, sources: uniqueSources, version };
}
