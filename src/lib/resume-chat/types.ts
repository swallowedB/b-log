import type { ContextDocument, ResumeFAQ, ResumeSource } from "@/lib/resume/types";

export type ChatInput = { message: string; requestId: string; history: { role: "user" | "assistant"; content: string }[] };
export type ChatIdentity = { visitorKey: string; ipKey: string | null };
export type ChatResult = { mode: "static" | "cache" | "ai" | "fallback"; answer: string; sources: ResumeSource[]; code?: string; remaining?: number; resetAt?: string };
export type GroundedModelOutput = { status: "answered" | "insufficient_context" | "out_of_scope"; answer: string; sourceIds: string[] };
export type QuotaDecision = { allowed: boolean; code?: string; remaining?: number; resetAt?: string };
export type Reservation = ChatIdentity & { requestId: string; inputHash: string };
export type CachedAnswer = { answer: string; sourceIds: string[] };
export type ChatStore = {
  reserve(input: Reservation): Promise<QuotaDecision>;
  finish(input: Reservation, status: "completed" | "failed"): Promise<void>;
  readCache(key: string): Promise<CachedAnswer | null>;
  writeCache(key: string, value: CachedAnswer): Promise<void>;
};
export type GenerateInput = Pick<ChatInput, "message" | "history"> & { context: ContextDocument[]; signal?: AbortSignal };
export type ChatDependencies = {
  faqs: readonly ResumeFAQ[]; documents: readonly ContextDocument[]; sources: readonly ResumeSource[];
  contentVersion: string; promptVersion: string; model: string;
  eligible(): Promise<boolean>; store: ChatStore | null;
  generate(input: GenerateInput): Promise<unknown>;
};
