import "server-only";
import { createHash } from "node:crypto";
import { JWT } from "google-auth-library";

// Official pricing + model support reviewed 2026-11-12. Change only through a reviewed PR.
export const FREE_MODEL = "gemini-3.5-flash-lite";
export type GeminiConfig = { apiKey: string; model: string; projectId: string; projectNumber: string; credentials: { client_email: string; private_key: string } };
export function loadGeminiConfig(): GeminiConfig | null {
  if (process.env.RESUME_CHAT_AI_ENABLED !== "true" || process.env.VERCEL_ENV !== "production" || process.env.CI) return null;
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const model = process.env.GEMINI_MODEL ?? FREE_MODEL;
  const projectId = process.env.GEMINI_FREE_PROJECT_ID ?? "";
  const projectNumber = process.env.GEMINI_FREE_PROJECT_NUMBER ?? "";
  if (!apiKey || model !== FREE_MODEL || !/^[a-z][a-z0-9-]{4,28}[a-z0-9]$/.test(projectId) || !/^[1-9][0-9]{5,19}$/.test(projectNumber)) return null;
  try {
    const credentials = JSON.parse(process.env.GOOGLE_FREE_TIER_READER_CREDENTIALS ?? "null");
    if (credentials?.type !== "service_account" || typeof credentials.client_email !== "string" || !credentials.client_email.endsWith(".gserviceaccount.com") || typeof credentials.private_key !== "string" || !credentials.private_key.startsWith("-----BEGIN PRIVATE KEY-----\n")) return null;
    // Select only required fields. Never accept a credential-supplied token endpoint.
    return { apiKey, model, projectId, projectNumber, credentials: { client_email: credentials.client_email, private_key: credentials.private_key } };
  } catch { return null; }
}

let verifiedKey: { fingerprint: string; parent: string } | null = null;
export function createFreeTierGuard(config: GeminiConfig): () => Promise<boolean> {
  return async () => {
    if (config.model !== FREE_MODEL || !/^[1-9][0-9]{5,19}$/.test(config.projectNumber)) return false;
    try {
      const auth = new JWT({ email: config.credentials.client_email, key: config.credentials.private_key, scopes: ["https://www.googleapis.com/auth/cloud-platform.read-only", "https://www.googleapis.com/auth/cloud-billing.readonly"], transporterOptions: { timeout: 1500, retry: false } });
      const { token } = await auth.getAccessToken();
      if (!token) return false;
      const read = async (url: string): Promise<Record<string, unknown>> => {
        const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(1500), cache: "no-store", redirect: "error" });
        if (!response.ok) throw new Error("PROJECT_CHECK_FAILED");
        const text = await response.text();
        if (text.length > 16384) throw new Error("PROJECT_CHECK_FAILED");
        const data: unknown = JSON.parse(text);
        if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error("PROJECT_CHECK_FAILED");
        return data as Record<string, unknown>;
      };
      const fingerprint = createHash("sha256").update(JSON.stringify([config.apiKey, config.projectNumber, config.projectId])).digest("hex");
      let parent = verifiedKey?.fingerprint === fingerprint ? verifiedKey.parent : null;
      if (!parent) {
        // Google requires keyString in this query. Never log this URL or raw errors.
        const key = await read(`https://apikeys.googleapis.com/v2/keys:lookupKey?keyString=${encodeURIComponent(config.apiKey)}`);
        parent = `projects/${config.projectNumber}/locations/global`;
        if (key.parent !== parent || typeof key.name !== "string" || !key.name.startsWith(`${parent}/keys/`) || key.name.length <= `${parent}/keys/`.length) return false;
        verifiedKey = { fingerprint, parent };
      }
      // Query the actual key's project number; do not query an independently configured unrelated ID.
      const actualNumber = parent.split("/")[1];
      const billing = await read(`https://cloudbilling.googleapis.com/v1/projects/${actualNumber}/billingInfo`);
      return billing.projectId === config.projectId && billing.billingEnabled === false && billing.billingAccountName === "";
    } catch { return false; }
  };
}
