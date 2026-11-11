import "server-only";
import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { isIP } from "node:net";
import type { ChatIdentity } from "./types";

export function getChatIdentity(request: Request): { identity: ChatIdentity; cookie?: string } | null {
  const secret = process.env.RESUME_CHAT_IDENTITY_SECRET;
  if (!secret || secret.length < 32) return null;
  const sign = (value: string) => createHmac("sha256", secret).update(value).digest("hex");
  const secure = new URL(request.url).protocol === "https:";
  const name = secure ? "__Host-boa_visitor" : "boa_visitor";
  const supplied = request.headers.get("cookie")?.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${name}=`))?.slice(name.length + 1);
  const parts = supplied?.split(".") ?? [];
  const payload = parts.slice(0, 2).join(".");
  const issued = Number(parts[1]);
  const valid = parts.length === 3 && /^[a-f0-9-]{36}$/.test(parts[0]) && /^[a-f0-9]{64}$/.test(parts[2]) && Number.isSafeInteger(issued) && Date.now() - issued >= -300000 && Date.now() - issued <= 30 * 86400000 && timingSafeEqual(Buffer.from(parts[2]), Buffer.from(sign(payload)));
  const id = valid ? parts[0] : randomUUID();
  const nextPayload = `${id}.${Date.now()}`;
  const candidateIP = process.env.VERCEL === "1" ? request.headers.get("x-vercel-forwarded-for")?.trim() : null;
  const ip = candidateIP && isIP(candidateIP) ? candidateIP : null;
  if (process.env.VERCEL_ENV === "production" && !ip) return null;
  return { identity: { visitorKey: sign(`visitor:${id}`), ipKey: ip ? sign(`ip:${new Date().toISOString().slice(0, 10)}:${ip}`) : null }, ...(!valid ? { cookie: `${name}=${nextPayload}.${sign(nextPayload)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000${secure ? "; Secure" : ""}` } : {}) };
}
