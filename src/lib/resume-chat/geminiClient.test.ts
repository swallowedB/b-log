/** @jest-environment node */
import { GoogleGenAI } from "@google/genai";
import { createGeminiAnswerer } from "./geminiClient.server";
import { loadGeminiConfig, createFreeTierGuard } from "./freeTierGuard.server";
jest.mock("server-only", () => ({}));
jest.mock("@google/genai", () => ({ GoogleGenAI: jest.fn(), ThinkingLevel: { MINIMAL: "MINIMAL" } }));
jest.mock("./freeTierGuard.server", () => ({ FREE_MODEL: "gemini-3.5-flash-lite", loadGeminiConfig: jest.fn(), createFreeTierGuard: jest.fn() }));
const generate = jest.fn();
const input = { message: "COMMA에서 무엇을 바꿨나요?", history: [], context: [{ id: "case:comma", title: "COMMA", text: "경과 시간 기준 이동으로 바꿨습니다.", tags: [], keywords: [], sourceIds: ["case:comma"] }] };
const success = () => ({ candidates: [{ finishReason: "STOP", content: { parts: [{ text: JSON.stringify({ status: "answered", answer: "경과 시간 기준으로 이동합니다.", sourceIds: ["case:comma"] }) }] } }] });
beforeEach(() => {
  jest.clearAllMocks(); generate.mockReset().mockResolvedValue(success());
  jest.mocked(loadGeminiConfig).mockReturnValue({ apiKey: "TEST_DEDICATED_KEY", model: "gemini-3.5-flash-lite", projectId: "boa-free", projectNumber: "123456789012", credentials: { client_email: "test", private_key: "test" } });
  jest.mocked(createFreeTierGuard).mockReturnValue(async () => true);
  jest.mocked(GoogleGenAI).mockImplementation(() => ({ models: { generateContent: generate } }) as unknown as GoogleGenAI);
});
it("never creates/calls an SDK without configuration or a passed free-project check", async () => {
  jest.mocked(loadGeminiConfig).mockReturnValueOnce(null); expect(createGeminiAnswerer()).toBeNull();
  jest.mocked(createFreeTierGuard).mockReturnValue(async () => false);
  const client = createGeminiAnswerer()!;
  expect(await client.eligible()).toBe(false);
  await expect(client.generate(input)).rejects.toThrow("FREE_TIER_NOT_VERIFIED");
  expect(GoogleGenAI).not.toHaveBeenCalled(); expect(generate).not.toHaveBeenCalled();
});
it("uses only the explicit Developer API key, fixed endpoint/model, one attempt and bounded structured generation", async () => {
  const client = createGeminiAnswerer()!;
  expect(await client.eligible()).toBe(true);
  expect(await client.generate(input)).toEqual({ status: "answered", answer: "경과 시간 기준으로 이동합니다.", sourceIds: ["case:comma"] });
  expect(GoogleGenAI).toHaveBeenCalledWith(expect.objectContaining({ apiKey: "TEST_DEDICATED_KEY", vertexai: false, httpOptions: expect.objectContaining({ baseUrl: "https://generativelanguage.googleapis.com", retryOptions: { attempts: 1 } }) }));
  expect(generate).toHaveBeenCalledTimes(1);
  expect(generate).toHaveBeenCalledWith(expect.objectContaining({ model: "gemini-3.5-flash-lite", config: expect.objectContaining({ maxOutputTokens: 512, responseMimeType: "application/json", responseJsonSchema: expect.any(Object) }) }));
  await expect(client.generate(input)).rejects.toThrow("FREE_TIER_NOT_VERIFIED");
  expect(generate).toHaveBeenCalledTimes(1);
});
it.each([429, 500, "timeout"])("does not retry or switch models after %p", async (failure) => {
  generate.mockRejectedValueOnce(new Error(String(failure)));
  const client = createGeminiAnswerer()!; await client.eligible();
  await expect(client.generate(input)).rejects.toThrow("GENERATION_FAILED"); expect(generate).toHaveBeenCalledTimes(1);
});
it.each([
  { candidates: [] },
  { candidates: [{ finishReason: "MAX_TOKENS", content: { parts: [{ text: "{}" }] } }] },
  { candidates: [{ finishReason: "STOP", content: { parts: [{ text: "{" }] } }] },
  { candidates: [{ finishReason: "STOP", content: { parts: [{ text: JSON.stringify({ status: "answered", answer: "없는 실적", sourceIds: ["case:other-public"] }) }] } }] },
])("rejects blocked, truncated, invalid and unrelated output", async (response) => {
  generate.mockResolvedValueOnce(response);
  const client = createGeminiAnswerer()!; await client.eligible();
  await expect(client.generate(input)).rejects.toThrow("GENERATION_FAILED"); expect(generate).toHaveBeenCalledTimes(1);
});
