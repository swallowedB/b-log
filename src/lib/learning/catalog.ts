import type { CaseFile, LearningEntry, LearningType, ResumeSource } from "@/lib/resume/types";

export function parseLearningType(value: unknown): LearningType | undefined {
  return value === "book" || value === "conference" || value === "course" ? value : undefined;
}

export function selectLearningEntries(entries: readonly LearningEntry[], type?: LearningType, limit = Infinity): LearningEntry[] {
  return entries.filter((entry) => entry.published && (!type || entry.type === type)).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.slug.localeCompare(b.slug)).slice(0, limit);
}

type ValidationInput = {
  learning: readonly LearningEntry[];
  cases: readonly CaseFile[];
  posts: readonly { slug: string; draft: boolean }[];
  projects: readonly { id: string }[];
};

export function validateLearningEntries(input: ValidationInput): void {
  const slugs = new Set<string>();
  for (const entry of input.learning) {
    if (slugs.has(entry.slug)) throw new Error(`Duplicate learning slug: ${entry.slug}`);
    slugs.add(entry.slug);
    for (const slug of entry.relatedPostSlugs) {
      const post = input.posts.find((post) => post.slug === slug);
      if (!post || (entry.published && post.draft)) throw new Error(`Invalid learning post: ${slug}`);
    }
    for (const id of entry.appliedTo.relatedCaseIds) {
      const related = input.cases.find((item) => `case:${item.slug}` === id);
      if (!related || (entry.published && !related.published)) throw new Error(`Invalid learning case: ${id}`);
    }
    for (const id of entry.appliedTo.relatedProjectIds) {
      if (!input.projects.some((item) => item.id === id)) throw new Error(`Invalid learning project: ${id}`);
    }
    if (entry.appliedTo.status === "applied" && !entry.appliedTo.relatedCaseIds.length && !entry.relatedPostSlugs.length && !entry.appliedTo.evidenceLinks.length) throw new Error(`Applied learning requires evidence: ${entry.slug}`);
    for (const url of [entry.originalUrl, ...entry.appliedTo.evidenceLinks.map((link) => link.url)]) {
      if (url && new URL(url).protocol !== "https:") throw new Error(`Learning evidence must use HTTPS: ${entry.slug}`);
    }
    if (entry.coverImage && !/^\/(?!\/)[\w/.-]+$/.test(entry.coverImage)) {
      const image = new URL(entry.coverImage);
      if (image.protocol !== "https:" || image.hostname !== "res.cloudinary.com") throw new Error(`Unsupported cover image: ${entry.slug}`);
    }
    for (const heading of ["Why", "Key Takeaways", "My Perspective"]) {
      if (!new RegExp(`^## ${heading}\\s*$`, "m").test(entry.raw)) throw new Error(`Missing learning section: ${heading}`);
    }
  }
}

export function getLearningReferences(entry: LearningEntry, sources: readonly ResumeSource[]): ResumeSource[] {
  const ids = [
    ...entry.appliedTo.relatedCaseIds,
    ...entry.relatedPostSlugs.map((slug) => `post:${slug}`),
    ...entry.appliedTo.evidenceLinks.map((_, index) => `learning-evidence:${entry.slug}:${index}`),
    ...entry.appliedTo.relatedProjectIds.map((id) => `project:${id}`),
    ...(entry.originalUrl ? [`learning-original:${entry.slug}`] : []),
  ];
  return [...new Set(ids)].map((id) => sources.find((source) => source.id === id)).filter((source): source is ResumeSource => Boolean(source));
}
