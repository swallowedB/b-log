/** @jest-environment node */
import { JWT } from "google-auth-library";
import { createFreeTierGuard, loadGeminiConfig, FREE_MODEL, type GeminiConfig } from "./freeTierGuard.server";
jest.mock("server-only", () => ({}));
jest.mock("google-auth-library", () => ({ JWT: jest.fn() }));
const env = { ...process.env };
let sequence = 0;
const config = (): GeminiConfig => ({ apiKey: `TEST_KEY_${++sequence}`, model: "gemini-3.5-flash-lite", projectId: "boa-free-project", projectNumber: "123456789012", credentials: { client_email: "reader@boa-free-project.iam.gserviceaccount.com", private_key: "-----BEGIN PRIVATE KEY-----\nTEST\n-----END PRIVATE KEY-----\n" } });
const originalFetch = globalThis.fetch;
beforeEach(() => { globalThis.fetch = jest.fn(); jest.mocked(JWT).mockImplementation(() => ({ getAccessToken: async () => ({ token: "TEST_TOKEN" }) }) as unknown as JWT); });
afterEach(() => { process.env = { ...env }; globalThis.fetch = originalFetch; jest.clearAllMocks(); });
const lookup = { parent: "projects/123456789012/locations/global", name: "projects/123456789012/locations/global/keys/test-key" };
const billing = { projectId: "boa-free-project", billingEnabled: false, billingAccountName: "" };
const respond = (value: unknown) => Response.json(value);

it("requires explicit production flag, dedicated key/project and readonly credentials", () => {
  process.env.RESUME_CHAT_AI_ENABLED = "true"; process.env.VERCEL_ENV = "production"; delete process.env.CI;
  const value = config();
  process.env.GEMINI_API_KEY = value.apiKey; process.env.GEMINI_FREE_PROJECT_ID = value.projectId; process.env.GEMINI_FREE_PROJECT_NUMBER = value.projectNumber;
  process.env.GOOGLE_FREE_TIER_READER_CREDENTIALS = JSON.stringify({ type: "service_account", ...value.credentials });
  expect(loadGeminiConfig()?.model).toBe(FREE_MODEL);
  process.env.GEMINI_MODEL = "gemini-4-carbon"; expect(loadGeminiConfig()).toBeNull();
  delete process.env.GEMINI_MODEL; process.env.VERCEL_ENV = "preview"; expect(loadGeminiConfig()).toBeNull();
  process.env.VERCEL_ENV = "production"; process.env.CI = "true"; expect(loadGeminiConfig()).toBeNull();
  delete process.env.CI; delete process.env.GEMINI_API_KEY; process.env.GOOGLE_API_KEY = "unrelated-key"; expect(loadGeminiConfig()).toBeNull();
});
it("checks the actual key project number, verifies returned project ID, and checks billing every time", async () => {
  const value = config();
  jest.mocked(fetch).mockResolvedValueOnce(respond(lookup)).mockResolvedValueOnce(respond(billing)).mockResolvedValueOnce(respond({ ...billing, billingEnabled: true }));
  const guard = createFreeTierGuard(value);
  expect(await guard()).toBe(true);
  expect(await guard()).toBe(false);
  expect(fetch).toHaveBeenCalledTimes(3);
  expect(String(jest.mocked(fetch).mock.calls[1][0])).toBe("https://cloudbilling.googleapis.com/v1/projects/123456789012/billingInfo");
  expect(JWT).toHaveBeenCalledWith(expect.objectContaining({ scopes: ["https://www.googleapis.com/auth/cloud-platform.read-only", "https://www.googleapis.com/auth/cloud-billing.readonly"] }));
});
it.each([
  { projectId: "another-free-project", billingEnabled: false, billingAccountName: "" },
  { ...billing, billingEnabled: true }, { ...billing, billingAccountName: "billingAccounts/linked" },
  { projectId: "boa-free-project" }, { ...billing, billingEnabled: null },
])("fails closed for ambiguous or linked billing %p", async (data) => {
  jest.mocked(fetch).mockResolvedValueOnce(respond(lookup)).mockResolvedValueOnce(respond(data));
  expect(await createFreeTierGuard(config())()).toBe(false);
});
it("never queries a different configured project's billing when key ownership mismatches", async () => {
  jest.mocked(fetch).mockResolvedValueOnce(respond({ ...lookup, parent: "projects/999999999999/locations/global" }));
  expect(await createFreeTierGuard(config())()).toBe(false); expect(fetch).toHaveBeenCalledTimes(1);
});
it.each(["lookup", "billing", "auth"])("fails closed when %s cannot be checked", async (failure) => {
  if (failure === "auth") jest.mocked(JWT).mockImplementation(() => ({ getAccessToken: async () => { throw new Error("denied"); } }) as unknown as JWT);
  else if (failure === "billing") jest.mocked(fetch).mockResolvedValueOnce(respond(lookup)).mockRejectedValueOnce(new Error("denied"));
  else jest.mocked(fetch).mockRejectedValueOnce(new Error("denied"));
  expect(await createFreeTierGuard(config())()).toBe(false);
});
