import { Redis } from "@upstash/redis";
import type { PlanId } from "./config";

export type LeadStatus = "new" | "contacted" | "purchased" | "rejected";

export type Lead = {
  id: string;
  createdAt: number; // unix ms
  name: string;
  phone: string; // faqat raqamlar, 998XXXXXXXXX
  company: string;
  position: string;
  plan: PlanId;
  // Meta uchun texnik ma'lumotlar
  ip?: string;
  ua?: string;
  fbp?: string;
  fbc?: string;
  sourceUrl?: string;
  utm?: Record<string, string>;
  // Holat
  status: LeadStatus;
  purchasedPlan?: PlanId;
  purchasedAt?: number;
  purchasedBy?: string;
  tgMessages?: { chatId: string; messageId: number }[];
};

const TTL_SECONDS = 60 * 60 * 24 * 365; // 1 yil

const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

const redis = url && token ? new Redis({ url, token }) : null;

// Redis ulanmagan bo'lsa (lokal test) — xotirada saqlaymiz.
// DIQQAT: Vercel'da albatta Upstash Redis ulang, aks holda "Sotib oldi" tugmasi lidni topa olmaydi.
const g = globalThis as unknown as { __mem?: Map<string, unknown> };
const mem = (g.__mem ??= new Map<string, unknown>());

export const storeIsPersistent = Boolean(redis);

export async function saveLead(lead: Lead) {
  if (redis) await redis.set(`lead:${lead.id}`, lead, { ex: TTL_SECONDS });
  else mem.set(`lead:${lead.id}`, lead);
}

export async function getLead(id: string): Promise<Lead | null> {
  if (redis) return (await redis.get<Lead>(`lead:${id}`)) ?? null;
  return (mem.get(`lead:${id}`) as Lead) ?? null;
}

/** Bir martalik qulf: true qaytsa — birinchi bo'lib bosildi (dublikat Purchase yuborilmasligi uchun) */
export async function acquireOnce(key: string, ttlSec = TTL_SECONDS): Promise<boolean> {
  if (redis) {
    const r = await redis.set(key, 1, { nx: true, ex: ttlSec });
    return r === "OK";
  }
  if (mem.has(key)) return false;
  mem.set(key, 1);
  return true;
}

export async function releaseOnce(key: string) {
  if (redis) await redis.del(key);
  else mem.delete(key);
}

/** Oddiy rate-limit: bir IP dan soatiga N ta so'rov */
export async function rateLimit(ip: string, limit = 8): Promise<boolean> {
  const key = `rl:${ip}:${Math.floor(Date.now() / 3_600_000)}`;
  if (redis) {
    const n = await redis.incr(key);
    if (n === 1) await redis.expire(key, 3600);
    return n <= limit;
  }
  const n = ((mem.get(key) as number) ?? 0) + 1;
  mem.set(key, n);
  return n <= limit;
}
