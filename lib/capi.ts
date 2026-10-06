import crypto from "crypto";
import { CURRENCY, EVENT, PLANS, type PlanId } from "./config";
import type { Lead } from "./store";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || process.env.META_PIXEL_ID;
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;
const API_VERSION = process.env.META_API_VERSION || "v23.0";
const TEST_CODE = process.env.META_TEST_EVENT_CODE; // faqat test paytida

const sha256 = (v: string) => crypto.createHash("sha256").update(v).digest("hex");

/** Meta talabiga ko'ra normalizatsiya + SHA-256 */
function hashed(v?: string | null) {
  if (!v) return undefined;
  const n = v.trim().toLowerCase();
  return n ? [sha256(n)] : undefined;
}

function splitName(full: string) {
  const parts = full.trim().split(/\s+/);
  return { fn: parts[0] ?? "", ln: parts.length > 1 ? parts[parts.length - 1] : "" };
}

function userData(lead: Lead) {
  const { fn, ln } = splitName(lead.name);
  return {
    ph: lead.phone ? [sha256(lead.phone)] : undefined, // 998901234567 ko'rinishida
    fn: hashed(fn),
    ln: hashed(ln),
    country: hashed("uz"),
    external_id: [sha256(`fazza-${lead.phone}`)],
    client_ip_address: lead.ip || undefined,
    client_user_agent: lead.ua || undefined,
    fbp: lead.fbp || undefined,
    fbc: lead.fbc || undefined,
  };
}

export const leadEventId = (id: string) => `lead_${id}`;
export const purchaseEventId = (id: string) => `purchase_${id}`;

type CapiResult = { ok: boolean; skipped?: boolean; error?: string; fbtrace?: string };

async function send(events: unknown[]): Promise<CapiResult> {
  if (!PIXEL_ID || !ACCESS_TOKEN) return { ok: false, skipped: true, error: "Pixel ID yoki token yo'q" };
  try {
    const res = await fetch(
      `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events?access_token=${encodeURIComponent(ACCESS_TOKEN)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: events, ...(TEST_CODE ? { test_event_code: TEST_CODE } : {}) }),
        cache: "no-store",
      }
    );
    const json = (await res.json().catch(() => ({}))) as { error?: { message?: string; fbtrace_id?: string } };
    if (!res.ok) return { ok: false, error: json.error?.message || `HTTP ${res.status}`, fbtrace: json.error?.fbtrace_id };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

/** Sayt formasi to'ldirilganda — Pixel bilan bir xil event_id (deduplikatsiya) */
export function sendLeadEvent(lead: Lead) {
  return send([
    {
      event_name: "Lead",
      event_time: Math.floor(lead.createdAt / 1000),
      event_id: leadEventId(lead.id),
      action_source: "website",
      event_source_url: lead.sourceUrl,
      user_data: userData(lead),
      custom_data: {
        content_name: EVENT.name,
        content_category: PLANS[lead.plan].title,
        value: PLANS[lead.plan].price,
        currency: CURRENCY,
      },
    },
  ]);
}

/** Telegram'da "Sotib oldi" bosilganda — server orqali Purchase */
export function sendPurchaseEvent(lead: Lead, plan: PlanId) {
  return send([
    {
      event_name: "Purchase",
      event_time: Math.floor(Date.now() / 1000),
      event_id: purchaseEventId(lead.id),
      action_source: "website",
      event_source_url: lead.sourceUrl,
      user_data: userData(lead),
      custom_data: {
        content_name: `${EVENT.name} — ${PLANS[plan].title}`,
        content_ids: [plan],
        content_type: "product",
        num_items: 1,
        value: PLANS[plan].price,
        currency: CURRENCY,
        order_id: lead.id,
      },
    },
  ]);
}
