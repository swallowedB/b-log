import "server-only";
import type { ContextDocument } from "@/lib/resume/types";

export function retrievePublishedContext(message: string, documents: readonly ContextDocument[], limit = 3): ContextDocument[] {
  const query = message.normalize("NFKC").toLowerCase();
  const stopwords = new Set(["어떻게", "무엇", "어떤", "알려줘", "설명", "주세요", "대한", "대해", "무슨", "있나요", "했나요", "인가요", "저는", "나는", "오늘"]);
  const terms = [...new Set(query.match(/[\p{L}\p{N}]{2,}/gu) ?? [])].filter((term) => !stopwords.has(term));
  const score = (document: ContextDocument) => {
    const keywords = [document.title, ...document.tags, ...document.keywords].map((value) => value.toLowerCase());
    const body = document.text.normalize("NFKC").toLowerCase();
    return keywords.reduce((sum, value) => sum + (value.length >= 2 && query.includes(value) ? 4 : terms.some((term) => value.includes(term)) ? 2 : 0), 0) + terms.filter((term) => body.includes(term)).length;
  };
  let budget = 6000;
  return documents.map((document) => ({ document, score: score(document) })).filter((item) => item.score > 0).sort((a, b) => b.score - a.score || a.document.id.localeCompare(b.document.id)).slice(0, Math.min(limit, 3)).map(({ document }) => {
    const text = Array.from(document.text).slice(0, budget).join("");
    budget -= Array.from(text).length;
    return { ...document, text };
  }).filter((document) => document.text.length > 0);
}
