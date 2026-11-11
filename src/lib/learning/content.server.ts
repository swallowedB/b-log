import "server-only";
import { getPublicLearningEntries } from "@/lib/resume/content.server";
export { getPublicLearningEntries };
export const getPublicLearningBySlug = (slug: string) => getPublicLearningEntries().find((entry) => entry.slug === slug) ?? null;
