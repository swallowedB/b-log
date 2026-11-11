import type { GroundedModelOutput } from "./types";

export function parseModelOutput(value: unknown, allowedSourceIds: readonly string[]): GroundedModelOutput | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const output = value as Record<string, unknown>;
  if (Object.keys(output).sort().join() !== "answer,sourceIds,status" || !["answered", "insufficient_context", "out_of_scope"].includes(output.status as string) || typeof output.answer !== "string" || !Array.isArray(output.sourceIds)) return null;
  if (output.status === "answered") {
    if (!output.answer.trim() || Array.from(output.answer).length > 1500 || /https?:|www\.|<[^>]*>|\[[^\]]*\]\s*\(/i.test(output.answer) || output.sourceIds.length < 1 || output.sourceIds.length > 3 || new Set(output.sourceIds).size !== output.sourceIds.length || !output.sourceIds.every((id) => typeof id === "string" && allowedSourceIds.includes(id))) return null;
  } else if (output.answer !== "" || output.sourceIds.length !== 0) return null;
  return output as GroundedModelOutput;
}
