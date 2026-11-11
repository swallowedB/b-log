import { render, screen } from "@testing-library/react";
import LearningDetailPage, { generateMetadata, generateStaticParams } from "./page";
import { getPublicLearningBySlug, getPublicLearningEntries } from "@/lib/learning/content.server";
import type { LearningEntry } from "@/lib/resume/types";

jest.mock("@/lib/learning/content.server", () => ({ getPublicLearningBySlug: jest.fn(), getPublicLearningEntries: jest.fn() }));
jest.mock("@/lib/resume/content.server", () => ({ getPublicSources: () => [{ id: "post:test", type: "post", title: "관련 기술 글", url: "/posts/test" }] }));
jest.mock("@/app/(layout)/posts/[slug]/_components/PostContent", () => ({ __esModule: true, default: () => <article>나의 학습 관점</article> }));
jest.mock("next/navigation", () => ({ notFound: () => { throw new Error("NOT_FOUND"); } }));
const entry: LearningEntry = { slug: "test", title: "테스트 후기", summary: "새로운 관점", type: "book", publishedAt: "2026-11-11", published: true, tags: ["React"], relatedPostSlugs: ["test"], appliedTo: { status: "planned", description: "다음 실험에 적용할 계획입니다.", relatedCaseIds: [], relatedProjectIds: [], evidenceLinks: [] }, raw: "", contextText: "", code: "" };

it("renders a separate review, planned status and existing technical post link with SEO", async () => {
  jest.mocked(getPublicLearningBySlug).mockReturnValue(entry);
  jest.mocked(getPublicLearningEntries).mockReturnValue([entry]);
  const params = Promise.resolve({ slug: "test" });
  render(await LearningDetailPage({ params }));
  expect(screen.getByText("나의 학습 관점")).toBeVisible();
  expect(screen.getByText("React")).toBeVisible();
  expect(screen.getByRole("heading", { name: "Applied To · 적용 예정" })).toBeVisible();
  expect(screen.getByRole("link", { name: /관련 기술 글/ })).toHaveAttribute("href", "/posts/test");
  expect(generateStaticParams()).toEqual([{ slug: "test" }]);
  expect((await generateMetadata({ params })).alternates?.canonical).toBe("https://b0o0a.com/learning/test");
});

it("rejects direct access to a record outside the public catalog", async () => {
  jest.mocked(getPublicLearningBySlug).mockReturnValue(null);
  await expect(LearningDetailPage({ params: Promise.resolve({ slug: "private" }) })).rejects.toThrow("NOT_FOUND");
});
