import { selectLearningEntries, parseLearningType, validateLearningEntries } from "./catalog";
import { buildResumeCatalog } from "@/lib/resume/catalog";
import type { CaseFile, LearningEntry } from "@/lib/resume/types";
import { getCaseReferences } from "@/lib/resume/catalog";

const entry: LearningEntry = {
  slug: "test-book", title: "테스트 도서 후기", type: "book", summary: "직접 정리한 관점",
  publishedAt: "2026-01-01", tags: ["React"], published: true, relatedPostSlugs: [],
  appliedTo: { status: "not_applied", description: "적용 전", relatedCaseIds: [], relatedProjectIds: [], evidenceLinks: [] },
  raw: "## Why\n선택 이유\n## Key Takeaways\n배움\n## My Perspective\n관점", code: "compiled", contextText: "학습한 내용",
};
const input = (learning: LearningEntry[]) => ({ learning, cases: [], projects: [], posts: [] });

it("filters published records and sorts newest first, with a bounded preview", () => {
  const entries: LearningEntry[] = [entry, { ...entry, slug: "new", type: "conference", publishedAt: "2026-02-01" }, { ...entry, slug: "private", published: false }];
  expect(selectLearningEntries(entries).map((item) => item.slug)).toEqual(["new", "test-book"]);
  expect(selectLearningEntries(entries, "book").map((item) => item.slug)).toEqual(["test-book"]);
  expect(selectLearningEntries(entries, undefined, 1).map((item) => item.slug)).toEqual(["new"]);
  expect(selectLearningEntries(entries, "course")).toEqual([]);
});

it.each([undefined, "invalid", ["book", "course"], 123])("defaults unsupported filter %p to all", (value) => {
  expect(parseLearningType(value)).toBeUndefined();
});

it("accepts each supported filter", () => {
  expect(parseLearningType("book")).toBe("book");
  expect(parseLearningType("conference")).toBe("conference");
  expect(parseLearningType("course")).toBe("course");
});

it("requires actual application evidence and valid related records", () => {
  expect(() => validateLearningEntries(input([{ ...entry, appliedTo: { ...entry.appliedTo, status: "applied" } }]))).toThrow();
  expect(() => validateLearningEntries(input([{ ...entry, relatedPostSlugs: ["missing"] }]))).toThrow();
  expect(() => validateLearningEntries(input([{ ...entry, originalUrl: "javascript:alert(1)" }]))).toThrow();
  expect(() => validateLearningEntries(input([entry, entry]))).toThrow();
  expect(() => validateLearningEntries(input([entry]))).not.toThrow();
});

it.each(["/learning/책표지.jpg", "/learning/%EC%B1%85.jpg"])("accepts a local cover filename %s", (coverImage) => {
  expect(() => validateLearningEntries(input([{ ...entry, coverImage }]))).not.toThrow();
});

it("adds a learning file to the shared public sources/context/version and excludes drafts", () => {
  const original = buildResumeCatalog(input([]));
  const updated = buildResumeCatalog(input([entry, { ...entry, slug: "draft", published: false, contextText: "PRIVATE_LEARNING_BODY" }]));
  expect(updated.sources.find((source) => source.id === "learning:test-book")?.url).toBe("/learning/test-book");
  expect(updated.context.find((item) => item.id === "learning:test-book")?.text).toContain("not_applied");
  expect(updated.version).not.toBe(original.version);
  expect(buildResumeCatalog(input([{ ...entry, summary: "수정한 관점" }])).version).not.toBe(buildResumeCatalog(input([entry])).version);
  expect(JSON.stringify(updated)).not.toContain("PRIVATE_LEARNING_BODY");
});

it("derives case backlinks from the learning file and rejects public references to drafts", () => {
  const caseEntry: CaseFile = { slug: "case", projectId: "test", title: "Test", summary: "Case", tags: [], keywords: [], publishedAt: "2026-01-01", published: true, featured: false, relatedPostSlugs: [], relatedLearningSlugs: [], evidenceLinks: [], raw: ["Problem", "Context", "Analysis", "Decision", "Action", "Result", "Insight"].map((section) => `## ${section}\n내용`).join("\n"), contextText: "내용", code: "" };
  const related = { ...entry, appliedTo: { ...entry.appliedTo, status: "applied" as const, relatedCaseIds: ["case:case"] } };
  const data = { learning: [related], cases: [caseEntry], projects: [{ id: "test", title: "Test", githubUrl: "https://example.com" }], posts: [] };
  const catalog = buildResumeCatalog(data);
  expect(getCaseReferences(catalog.cases[0], catalog.sources).map((source) => source.url)).toContain("/learning/test-book");
  expect(() => buildResumeCatalog({ ...data, cases: [{ ...caseEntry, published: false }] })).toThrow("Invalid learning case");
});
