import type { ResumeFAQ, StaticAnswer } from "./types";

export function normalizeQuestion(message: string): string {
  return message.normalize("NFKC").trim().toLowerCase().replace(/[\s?!.。]+/gu, "");
}

export function getStaticAnswer(message: string, faqs: readonly ResumeFAQ[]): StaticAnswer | null {
  const normalized = normalizeQuestion(message);
  if (!normalized) return null;
  const faq = faqs.find((entry) => [entry.question, ...entry.aliases].some((question) => normalizeQuestion(question) === normalized));
  return faq ? { answer: faq.answer, sources: faq.sources } : null;
}
