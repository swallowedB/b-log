/** @jest-environment node */
// Use the real official SDK with intercepted HTTP, rather than mocking its retry implementation.
import { createGeminiAnswerer } from "./geminiClient.server";
jest.mock("server-only", () => ({}));
jest.mock("./freeTierGuard.server", () => ({
  loadGeminiConfig: () => ({ apiKey: "TEST_EXPLICIT_KEY", model: "gemini-3.5-flash-lite", projectId: "boa-free", projectNumber: "123456789012", credentials: {} }),
  createFreeTierGuard: () => async () => true,
}));
const originalFetch = globalThis.fetch;
const env = { ...process.env };
afterEach(() => { globalThis.fetch = originalFetch; process.env = { ...env }; });
const input = { message: "시간 보정은?", history: [], context: [{ id: "case:timing", title: "시간 보정", text: "Delta Time을 적용했습니다.", tags: [], keywords: [], sourceIds: ["case:timing"] }] };

it.each([429, 500])("the actual SDK sends exactly one HTTP request on %i", async (status) => {
  globalThis.fetch = jest.fn(async () => Response.json({ error: { code: status, message: "TEST_FAILURE", status: status === 429 ? "RESOURCE_EXHAUSTED" : "INTERNAL" } }, { status }));
  const client = createGeminiAnswerer()!; await client.eligible();
  await expect(client.generate(input)).rejects.toThrow("GENERATION_FAILED");
  expect(fetch).toHaveBeenCalledTimes(1);
});
it("the actual SDK uses the dedicated key and fixed Developer endpoint despite unrelated environment defaults", async () => {
  process.env.GOOGLE_API_KEY = "UNRELATED_KEY"; process.env.GOOGLE_GENAI_USE_VERTEXAI = "true"; process.env.GOOGLE_GEMINI_BASE_URL = "https://unrelated.invalid";
  globalThis.fetch = jest.fn(async () => Response.json({ candidates: [{ finishReason: "STOP", content: { role: "model", parts: [{ text: JSON.stringify({ status: "answered", answer: "Delta Time을 적용했습니다.", sourceIds: ["case:timing"] }) }] } }] }));
  const client = createGeminiAnswerer()!; await client.eligible();
  expect((await client.generate(input)).status).toBe("answered");
  const [url, options] = jest.mocked(fetch).mock.calls[0];
  expect(String(url)).toContain("https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent");
  const headers = new Headers(options?.headers);
  expect(headers.get("x-goog-api-key")).toBe("TEST_EXPLICIT_KEY");
  expect(String(options?.body)).not.toContain("UNRELATED_KEY");
});
