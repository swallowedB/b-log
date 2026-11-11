import "server-only";
import { createHash } from "node:crypto";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import type { ChatStore } from "./types";

export function getChatEnvironment(): string {
  if (process.env.VERCEL_ENV === "production") return "production";
  if (process.env.VERCEL_ENV === "preview") return `preview:${createHash("sha256").update(process.env.VERCEL_GIT_COMMIT_REF ?? "unknown").digest("hex").slice(0, 16)}`;
  return "development";
}

export function createChatStore(): ChatStore | null {
  const db = getSupabaseAdmin();
  if (!db) return null;
  const environment = getChatEnvironment();
  const configured = Number(process.env.RESUME_CHAT_GLOBAL_RPM ?? 3);
  const rpm = Number.isInteger(configured) && configured >= 1 && configured <= 30 ? configured : 3;
  return {
    async reserve(input) {
      const { data, error } = await db.rpc("reserve_resume_chat_request", { p_environment: environment, p_visitor_key: input.visitorKey, p_ip_key: input.ipKey, p_request_id: input.requestId, p_input_hash: input.inputHash, p_global_rpm: rpm }).abortSignal(AbortSignal.timeout(2500));
      if (error || !data || typeof data.allowed !== "boolean") throw new Error("QUOTA_STORE_UNAVAILABLE");
      return data;
    },
    async finish(input, status) {
      const { error } = await db.from("resume_chat_requests").update({ status }).eq("environment", environment).eq("visitor_key", input.visitorKey).eq("request_id", input.requestId).eq("input_hash", input.inputHash).eq("status", "reserved").gt("expires_at", new Date().toISOString()).abortSignal(AbortSignal.timeout(2500));
      if (error) throw new Error("REQUEST_STATUS_UNAVAILABLE");
    },
    async readCache(key) {
      const { data, error } = await db.from("resume_chat_answer_cache").select("answer,source_ids").eq("environment", environment).eq("cache_key", key).gt("expires_at", new Date().toISOString()).abortSignal(AbortSignal.timeout(2500)).maybeSingle();
      if (error) throw new Error("CACHE_UNAVAILABLE");
      return data ? { answer: data.answer, sourceIds: data.source_ids } : null;
    },
    async writeCache(key, value) {
      const { error } = await db.from("resume_chat_answer_cache").upsert({ environment, cache_key: key, answer: value.answer, source_ids: value.sourceIds, expires_at: new Date(Date.now() + 86400000).toISOString() }).abortSignal(AbortSignal.timeout(2500));
      if (error) throw new Error("CACHE_UNAVAILABLE");
    },
  };
}
