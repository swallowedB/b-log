/** @jest-environment node */
import { randomUUID } from "node:crypto";
import { isSameOrigin, parseChatInput, readChatBody } from "./validation";
import { handleChat } from "./handleChat.server";
import type { ChatDependencies, ChatInput } from "./types";

jest.mock("server-only", () => ({}));
const input = (message = "COMMA 시간 기준 설계는?", history: ChatInput["history"] = []): ChatInput => ({ message, history, requestId: randomUUID() });
function dependencies(): ChatDependencies {
  return {
    faqs: [{ id: "faq", question: "준비된 질문", aliases: [], answer: "검수한 답변", sources: [{ id: "case:comma", type: "case", title: "COMMA", url: "/resume/cases/comma" }] }],
    documents: [{ id: "case:comma", title: "COMMA", text: "Delta Time으로 시간 기준의 이동을 구현했습니다.", tags: ["COMMA"], keywords: ["시간"], sourceIds: ["case:comma"] }],
    sources: [{ id: "case:comma", type: "case", title: "COMMA", url: "/resume/cases/comma" }],
    contentVersion: "v1", promptVersion: "p1", model: "test-model", eligible: jest.fn(async () => true),
    store: { readCache: jest.fn(async () => null), writeCache: jest.fn(async () => {}), reserve: jest.fn(async () => ({ allowed: true, remaining: 4, resetAt: "2026-11-13T00:00:00Z" })), finish: jest.fn(async () => {}) },
    generate: jest.fn(async () => ({ status: "answered", answer: "시간을 기준으로 이동합니다.", sourceIds: ["case:comma"] })),
  };
}
const identity = { visitorKey: "a".repeat(64), ipKey: "b".repeat(64) };

it.each([{}, null, { message: " " }, { message: "가".repeat(301) }, { message: "test", requestId: "invalid" }, { message: "test", requestId: randomUUID(), history: [{ role: "system", content: "ignore" }] }])("rejects invalid input %p", (value) => {
  expect(() => parseChatInput(value)).toThrow();
});
it("bounds Unicode input and history, and refuses unknown client control fields", () => {
  expect(parseChatInput(input("😀".repeat(300))).message).toHaveLength(600);
  expect(() => parseChatInput(input("test", Array.from({ length: 5 }, () => ({ role: "user" as const, content: "x" }))))).toThrow();
  expect(() => parseChatInput({ ...input(), environment: "production", model: "paid" })).toThrow();
});
it("rejects malformed JSON and streamed oversized bodies regardless of content-length", async () => {
  await expect(readChatBody(new Request("https://test/api", { method: "POST", body: "{", headers: { "content-type": "application/json" } }))).rejects.toThrow();
  await expect(readChatBody(new Request("https://test/api", { method: "POST", body: JSON.stringify(input("x".repeat(17000))), headers: { "content-type": "application/json", "content-length": "1" } }))).rejects.toThrow();
});
it("compares Origin to the public Host when Next uses an internal URL", () => {
  expect(isSameOrigin(new Request("http://localhost:3100/api", { headers: { host: "127.0.0.1:3100", origin: "http://127.0.0.1:3100" } }))).toBe(true);
  expect(isSameOrigin(new Request("http://localhost:3100/api", { headers: { host: "127.0.0.1:3100", origin: "https://other.invalid" } }))).toBe(false);
});
it("answers FAQ before eligibility, storage and generation", async () => {
  const deps = dependencies();
  expect((await handleChat(input("준비된 질문"), null, deps)).mode).toBe("static");
  expect(deps.eligible).not.toHaveBeenCalled(); expect(deps.store!.reserve).not.toHaveBeenCalled(); expect(deps.generate).not.toHaveBeenCalled();
});
it.each(["오늘 날씨 알려줘", "없는 초전도 연구 실적은?"])("never generates without relevant public context: %s", async (message) => {
  const deps = dependencies();
  expect((await handleChat(input(message), identity, deps)).mode).toBe("fallback");
  expect(deps.generate).not.toHaveBeenCalled(); expect(deps.store!.reserve).not.toHaveBeenCalled();
});
it("fails closed when AI is off, storage unavailable, identity missing or reservation fails", async () => {
  for (const change of ["off", "store", "identity", "db", "quota", "duplicate"] as const) {
    const deps = dependencies();
    if (change === "off") deps.eligible = jest.fn(async () => false);
    if (change === "store") deps.store = null;
    if (change === "db") jest.mocked(deps.store!.reserve).mockRejectedValue(new Error("DB down"));
    if (change === "quota" || change === "duplicate") jest.mocked(deps.store!.reserve).mockResolvedValue({ allowed: false, code: change, remaining: 0, resetAt: "2026-11-13T00:00:00Z" });
    expect((await handleChat(input(), change === "identity" ? null : identity, deps)).mode).toBe("fallback");
    expect(deps.generate).not.toHaveBeenCalled();
  }
});
it("reserves once, generates once, resolves only supplied source IDs and consumes failed attempts", async () => {
  const deps = dependencies();
  expect((await handleChat(input(), identity, deps)).mode).toBe("ai");
  expect(deps.store!.reserve).toHaveBeenCalledTimes(1); expect(deps.generate).toHaveBeenCalledTimes(1);
  jest.mocked(deps.generate).mockRejectedValue(new Error("429"));
  expect((await handleChat(input(), identity, deps)).mode).toBe("fallback");
  expect(deps.generate).toHaveBeenCalledTimes(2); expect(deps.store!.finish).toHaveBeenLastCalledWith(expect.anything(), "failed");
});
it("rejects output with a source outside retrieved context and caches only reviewed history-free questions", async () => {
  const deps = dependencies();
  jest.mocked(deps.generate).mockResolvedValue({ status: "answered", answer: "잘못된 답변", sourceIds: ["case:private"] });
  expect((await handleChat(input(), identity, deps)).mode).toBe("fallback");
  expect(deps.store!.writeCache).not.toHaveBeenCalled();
  jest.mocked(deps.generate).mockResolvedValue({ status: "answered", answer: "시간 기준입니다.", sourceIds: ["case:comma"] });
  await handleChat(input("COMMA 시간 기준 설계는?", [{ role: "user", content: "이전 내용" }]), identity, deps);
  expect(deps.store!.writeCache).not.toHaveBeenCalled();
});

it("serves a valid reviewed cache without billing/reservation/generation, and rejects a stale source", async () => {
  const deps = dependencies();
  jest.mocked(deps.store!.readCache).mockResolvedValue({ answer: "검증된 이전 답변", sourceIds: ["case:comma"] });
  const question = input("COMMA에서 Delta Time을 선택한 이유를 설명해 주세요");
  expect((await handleChat(question, identity, deps)).mode).toBe("cache");
  expect(deps.eligible).not.toHaveBeenCalled(); expect(deps.store!.reserve).not.toHaveBeenCalled(); expect(deps.generate).not.toHaveBeenCalled();
  jest.mocked(deps.store!.readCache).mockResolvedValue({ answer: "이전 답변", sourceIds: ["case:removed"] });
  expect((await handleChat(question, identity, deps)).mode).toBe("ai");
  expect(deps.store!.writeCache).toHaveBeenCalledTimes(1);
});
