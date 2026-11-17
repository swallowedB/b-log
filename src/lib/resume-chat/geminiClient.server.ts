import "server-only";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { createFreeTierGuard, loadGeminiConfig } from "./freeTierGuard.server";
import { buildPrompt } from "./prompt.server";
import { parseModelOutput } from "./modelOutput";
import type { GenerateInput, GroundedModelOutput } from "./types";

export function createGeminiAnswerer() {
  const config = loadGeminiConfig();
  if (!config) return null;
  const guard = createFreeTierGuard(config);
  let verified = false;
  return {
    async eligible(): Promise<boolean> { verified = await guard(); return verified; },
    async generate(input: GenerateInput): Promise<GroundedModelOutput> {
      if (!verified) throw new Error("FREE_TIER_NOT_VERIFIED");
      verified = false; // A passed check permits at most one attempt, never an automatic retry.
      try {
        const prompt = buildPrompt(input);
        if (!prompt.allowedSourceIds.length) throw new Error("NO_PUBLIC_CONTEXT");
        const client = new GoogleGenAI({ apiKey: config.apiKey, vertexai: false, httpOptions: { baseUrl: "https://generativelanguage.googleapis.com", apiVersion: "v1beta", timeout: 7000, retryOptions: { attempts: 1 } } });
        const response = await client.models.generateContent({ model: config.model, contents: [{ role: "user", parts: [{ text: prompt.data }] }], config: { abortSignal: input.signal ? AbortSignal.any([input.signal, AbortSignal.timeout(7000)]) : AbortSignal.timeout(7000), systemInstruction: prompt.systemInstruction, responseMimeType: "application/json", responseJsonSchema: prompt.schema, maxOutputTokens: 512, thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL, includeThoughts: false }, httpOptions: { timeout: 7000, retryOptions: { attempts: 1 } } } });
        const candidate = response.candidates?.length === 1 ? response.candidates[0] : null;
        const parts = candidate?.content?.parts;
        if (response.promptFeedback?.blockReason || candidate?.finishReason !== "STOP" || parts?.length !== 1 || parts[0].thought || typeof parts[0].text !== "string") throw new Error("INVALID_OUTPUT");
        const output = parseModelOutput(JSON.parse(parts[0].text), prompt.allowedSourceIds);
        if (!output) throw new Error("INVALID_OUTPUT");
        return output;
      } catch { throw new Error("GENERATION_FAILED"); }
    },
  };
}
