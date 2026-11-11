/** @jest-environment node */
import { JWT } from "google-auth-library";
import { createGeminiAnswerer } from "./geminiClient.server";
import { handleChat } from "./handleChat.server";
import type { ChatStore } from "./types";
jest.mock("server-only", () => ({}));
jest.mock("google-auth-library", () => ({ JWT: jest.fn() }));
const env = { ...process.env }; const originalFetch = globalThis.fetch;
let nextKey = 0;
beforeEach(() => {
  process.env.RESUME_CHAT_AI_ENABLED = "true"; process.env.VERCEL_ENV = "production"; delete process.env.CI;
  process.env.GEMINI_API_KEY = `TEST_GATE_KEY_${++nextKey}`; process.env.GEMINI_MODEL = "gemini-3.5-flash-lite";
  process.env.GEMINI_FREE_PROJECT_ID = "boa-free-project"; process.env.GEMINI_FREE_PROJECT_NUMBER = "123456789012";
  process.env.GOOGLE_FREE_TIER_READER_CREDENTIALS = JSON.stringify({ type: "service_account", client_email: "reader@boa-free-project.iam.gserviceaccount.com", private_key: "-----BEGIN PRIVATE KEY-----\nTEST\n-----END PRIVATE KEY-----\n" });
  jest.mocked(JWT).mockImplementation(() => ({ getAccessToken: async () => ({ token: "TEST_TOKEN" }) }) as unknown as JWT);
});
afterEach(() => { process.env = { ...env }; globalThis.fetch = originalFetch; jest.clearAllMocks(); });

it.each(["wrong-key-project", "billing-linked", "lookup-error", "billing-error", "no-reader"])("the connected handler and real guard generate zero for %s", async (failure) => {
  if (failure === "no-reader") delete process.env.GOOGLE_FREE_TIER_READER_CREDENTIALS;
  globalThis.fetch = jest.fn(async (url) => {
    if (String(url).includes("apikeys.googleapis.com")) return failure === "lookup-error" ? new Response("", { status: 403 }) : Response.json({ parent: `projects/${failure === "wrong-key-project" ? "999999999999" : "123456789012"}/locations/global`, name: "projects/123456789012/locations/global/keys/test" });
    if (String(url).includes("cloudbilling.googleapis.com")) return failure === "billing-error" ? new Response("", { status: 503 }) : Response.json({ projectId: "boa-free-project", billingEnabled: true, billingAccountName: "billingAccounts/linked" });
    throw new Error("UNEXPECTED_GENERATION");
  });
  const client = createGeminiAnswerer();
  const store: ChatStore = { reserve: jest.fn(), finish: jest.fn(), readCache: jest.fn(), writeCache: jest.fn() };
  const result = await handleChat({ message: "COMMA 시간 보정 배경은?", history: [], requestId: "4adc2052-9cca-4cbe-849b-85bb04613def" }, { visitorKey: "a".repeat(64), ipKey: "b".repeat(64) }, { faqs: [], sources: [{ id: "case:comma", type: "case", title: "COMMA", url: "/resume/cases/comma" }], documents: [{ id: "case:comma", title: "COMMA", text: "시간 기준 이동", keywords: [], tags: [], sourceIds: ["case:comma"] }], contentVersion: "v1", promptVersion: "p1", model: "gemini-3.5-flash-lite", store, eligible: client?.eligible ?? (async () => false), generate: client?.generate ?? (async () => { throw new Error("OFF"); }) });
  expect(result.mode).toBe("fallback"); expect(store.reserve).not.toHaveBeenCalled();
  expect(jest.mocked(fetch).mock.calls.filter(([url]) => String(url).includes("generativelanguage.googleapis.com"))).toHaveLength(0);
});
