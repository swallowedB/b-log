/** @jest-environment node */
import { getChatIdentity } from "./identity.server";
import { answerCacheKey } from "./cache.server";
import { retrievePublishedContext } from "./retrieveContext.server";
jest.mock("server-only", () => ({}));
const env = { ...process.env };
afterEach(() => { process.env = { ...env }; });

it("signs an expiring host cookie, refuses forgery, and ignores client proxy headers outside Vercel", () => {
  process.env.RESUME_CHAT_IDENTITY_SECRET = "test-only-identity-secret-at-least-32-characters";
  delete process.env.VERCEL;
  const first = getChatIdentity(new Request("https://test/api", { headers: { "x-vercel-forwarded-for": "1.2.3.4" } }))!;
  expect(first.identity.ipKey).toBeNull();
  expect(first.cookie).toContain("HttpOnly; SameSite=Lax"); expect(first.cookie).toContain("Secure");
  const cookie = first.cookie!.split(";")[0];
  const again = getChatIdentity(new Request("https://test/api", { headers: { cookie } }))!;
  expect(again.identity.visitorKey).toBe(first.identity.visitorKey); expect(again.cookie).toBeUndefined();
  expect(getChatIdentity(new Request("https://test/api", { headers: { cookie: cookie.replace(/.$/, cookie.endsWith("a") ? "b" : "a") } }))!.identity.visitorKey).not.toBe(first.identity.visitorKey);
});
it("requires a valid platform IP in production and rotates its HMAC daily", () => {
  process.env.RESUME_CHAT_IDENTITY_SECRET = "test-only-identity-secret-at-least-32-characters";
  process.env.VERCEL = "1"; process.env.VERCEL_ENV = "production";
  expect(getChatIdentity(new Request("https://test/api"))).toBeNull();
  const result = getChatIdentity(new Request("https://test/api", { headers: { "x-vercel-forwarded-for": "1.2.3.4" } }))!;
  expect(result.identity.ipKey).toMatch(/^[a-f0-9]{64}$/); expect(result.cookie).not.toContain("1.2.3.4");
});
it("versions approved cache questions and never persists history or arbitrary user input", () => {
  const input = { message: "COMMA에서 Delta Time을 선택한 이유를 설명해 주세요", history: [], requestId: "id" };
  const key = answerCacheKey(input, "c1", "p1", "m1");
  expect(key).toMatch(/^[a-f0-9]{64}$/);
  expect(answerCacheKey(input, "c2", "p1", "m1")).not.toBe(key);
  expect(answerCacheKey(input, "c1", "p2", "m1")).not.toBe(key);
  expect(answerCacheKey({ ...input, history: [{ role: "user", content: "private" }] }, "c1", "p1", "m1")).toBeNull();
  expect(answerCacheKey({ ...input, message: "제 개인 연락처는…" }, "c1", "p1", "m1")).toBeNull();
});
it("limits retrieved public text to three documents and 6000 Unicode characters", () => {
  const documents = Array.from({ length: 5 }, (_, index) => ({ id: `${index}`, title: "COMMA", text: "가".repeat(4000), tags: [], keywords: [], sourceIds: [`${index}`] }));
  const result = retrievePublishedContext("COMMA에 대해", documents);
  expect(result.length).toBeLessThanOrEqual(3);
  expect(result.reduce((sum, item) => sum + Array.from(item.text).length, 0)).toBe(6000);
});

it("finds a question whose technical term exists only in the public body", () => {
  const documents = [{ id: "case:timing", title: "게임 속도 보정", text: "requestAnimationFrame의 timestamp를 기준으로 경과 시간을 계산합니다.", tags: [], keywords: [], sourceIds: ["case:timing"] }];
  expect(retrievePublishedContext("timestamp 선택 기준은?", documents).map((item) => item.id)).toEqual(["case:timing"]);
  expect(retrievePublishedContext("오늘 날씨 알려줘", documents)).toEqual([]);
});
