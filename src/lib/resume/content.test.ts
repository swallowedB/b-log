import { buildResumeCatalog, getCaseReferences, validateCases } from "./catalog";
import { getStaticAnswer } from "./staticAnswers";
import type { CaseFile } from "./types";

const body = ["Problem", "Context", "Analysis", "Decision", "Action", "Result", "Insight"].map((heading) => `## ${heading}\nVerified record.`).join("\n\n");
const publicCase: CaseFile = {
  slug: "timing", projectId: "comma", title: "Timing case", summary: "Time-based updates",
  tags: ["Game"], keywords: ["timing"], publishedAt: "2026-01-01", published: true,
  featured: true, relatedPostSlugs: ["timing-post"], relatedLearningSlugs: [], evidenceLinks: [],
  chat: { question: "게임 속도 문제는?", aliases: ["주사율 문제"], answer: "시간을 기준으로 이동하도록 변경했습니다." },
  raw: body, contextText: "Verified timing result", code: "compiled mdx",
};
const draftCase: CaseFile = { ...publicCase, slug: "secret-draft", published: false, summary: "PRIVATE_CASE_MARKER" };
const posts = [{ slug: "timing-post", title: "Timing post", draft: false }];
const projects = [{ id: "comma", title: "Comma", githubUrl: "https://github.com/swallowedB/Comma" }];
const build = (cases: CaseFile[] = [publicCase, draftCase]) => buildResumeCatalog({ cases, posts, projects });

describe("public Resume content", () => {
  it("exposes only published cases, questions, context and source IDs", () => {
    const catalog = build();
    expect(catalog.cases.map((entry) => entry.slug)).toEqual(["timing"]);
    expect(catalog.faqs.map((faq) => faq.question)).toEqual(["게임 속도 문제는?"]);
    expect(catalog.context.map((entry) => entry.id)).toEqual(["case:timing"]);
    expect(catalog.sources.find((source) => source.id === "case:timing")?.url).toBe("/resume/cases/timing");
    expect(JSON.stringify(catalog)).not.toContain("PRIVATE_CASE_MARKER");
    expect(catalog.sources.some((source) => source.id === "case:secret-draft")).toBe(false);
  });

  it("derives all public views after adding one entry without a registry update", () => {
    const next = { ...publicCase, slug: "next", publishedAt: "2026-02-01", chat: { ...publicCase.chat!, question: "다음 질문" } };
    const catalog = build([publicCase, next]);
    expect(catalog.cases.map((entry) => entry.slug)).toEqual(["next", "timing"]);
    expect(catalog.faqs).toHaveLength(2);
    expect(catalog.context.map((entry) => entry.id)).toContain("case:next");
    expect(catalog.sources.find((source) => source.id === "case:next")?.url).toBe("/resume/cases/next");
  });

  it("versions public updates and withdrawal, while ignoring draft edits", () => {
    const original = build().version;
    expect(build([{ ...publicCase, summary: "Updated public summary" }, draftCase]).version).not.toBe(original);
    expect(build([{ ...publicCase, published: false }, draftCase]).version).not.toBe(original);
    expect(build([publicCase, { ...draftCase, summary: "Different private text" }]).version).toBe(original);
  });

  it("answers exact reviewed aliases after normalization, without guessing unrelated questions", () => {
    expect(getStaticAnswer("  주사율 문제？ ", build().faqs)?.answer).toBe("시간을 기준으로 이동하도록 변경했습니다.");
    expect(getStaticAnswer("오늘 날씨", build().faqs)).toBeNull();
    expect(getStaticAnswer("", build().faqs)).toBeNull();
  });

  it("keeps external evidence in detail references, answers and the complete model context", () => {
    const entry = { ...publicCase, evidenceLinks: [{ title: "Verified PR", url: "https://example.com/pr/1" }] };
    const catalog = build([entry]);
    expect(catalog.faqs[0].sources.map((source) => source.id)).toEqual(["case:timing", "evidence:timing:0", "post:timing-post"]);
    expect(catalog.context[0].sourceIds).toEqual(["case:timing", "evidence:timing:0", "post:timing-post", "project:comma"]);
    expect(getCaseReferences(entry, catalog.sources).map((source) => source.url)).toEqual(["https://example.com/pr/1", "/posts/timing-post", "https://github.com/swallowedB/Comma"]);
  });

  it.each([
    ["duplicate slug", [publicCase, publicCase]],
    ["missing project", [{ ...publicCase, projectId: "missing" }]],
    ["missing post", [{ ...publicCase, relatedPostSlugs: ["missing"] }]],
    ["incomplete sections", [{ ...publicCase, raw: "## Problem\nOnly one section" }]],
    ["unsafe URL", [{ ...publicCase, evidenceLinks: [{ title: "Bad", url: "javascript:alert(1)" }] }]],
  ])("rejects %s at the content boundary", (_reason, cases) => {
    expect(() => validateCases({ cases: cases as CaseFile[], posts, projects })).toThrow();
  });

  it("rejects a public case citing a draft post", () => {
    expect(() => validateCases({ cases: [publicCase], posts: [{ ...posts[0], draft: true }], projects })).toThrow();
  });
});
