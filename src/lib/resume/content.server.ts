import "server-only";
import { cases, learning, posts } from "#site";
import { projectItems } from "@/app/(layout)/(shell)/resume/_constants/resume.projects";
import { buildResumeCatalog } from "./catalog";
import { getProfileFAQs } from "./profileFAQs";

const catalog = buildResumeCatalog({ cases, learning, posts, projects: projectItems, baseFAQs: getProfileFAQs() });

export const getPublicCases = () => catalog.cases;
export const getPublicCaseBySlug = (slug: string) => catalog.cases.find((entry) => entry.slug === slug) ?? null;
export const getPublicFAQs = () => catalog.faqs;
export const getPublicContextDocuments = () => catalog.context;
export const getPublicSources = () => catalog.sources;
export const getContentVersion = () => catalog.version;
export const getPublicLearningEntries = () => catalog.learning;
