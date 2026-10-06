import { EVENT, PLANS, formatPrice } from "./config";
import type { Lead } from "./store";

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const API = `https://api.telegram.org/bot${TOKEN}`;

/** Bir nechta chat bo'lishi mumkin: "-1001234567890,123456789" */
export const adminChatIds = (process.env.TELEGRAM_CHAT_ID || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

export async function tg<T = unknown>(method: string, body: Record<string, unknown>): Promise<{ ok: boolean; result?: T; description?: string }> {
  if (!TOKEN) return { ok: false, description: "TELEGRAM_BOT_TOKEN yo'q" };
  try {
    const r = await fetch(`${API}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    return await r.json();
  } catch (e) {
    return { ok: false, description: (e as Error).message };
  }
}

export const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function formatPhone(p: string) {
  const d = p.replace(/\D/g, "");
  if (d.length === 12 && d.startsWith("998"))
    return `+998 ${d.slice(3, 5)} ${d.slice(5, 8)} ${d.slice(8, 10)} ${d.slice(10)}`;
  return `+${d}`;
}

function tashkentTime(ms: number) {
  return new Date(ms).toLocaleString("ru-RU", { timeZone: "Asia/Tashkent", dateStyle: "short", timeStyle: "short" });
}

const STATUS_LINE: Record<Lead["status"], string> = {
  new: "🟡 <b>Holat:</b> yangi lid",
  contacted: "🔵 <b>Holat:</b> bog'lanildi",
  purchased: "✅ <b>Holat:</b> SOTIB OLDI",
  rejected: "⚪️ <b>Holat:</b> rad etdi",
};

export function leadText(lead: Lead, extra?: string) {
  const utm = lead.utm || {};
  const utmLine = [utm.utm_source, utm.utm_campaign, utm.utm_content].filter(Boolean).join(" / ");
  const lines: (string | null)[] = [
    `🔥 <b>Yangi lid — ${esc(EVENT.name)}</b>`,
    ``,
    `👤 <b>Ism:</b> ${esc(lead.name)}`,
    `📞 <b>Telefon:</b> <code>${formatPhone(lead.phone)}</code>`,
    lead.company ? `🏢 <b>Kompaniya:</b> ${esc(lead.company)}` : null,
    lead.position ? `💼 <b>Lavozim:</b> ${esc(lead.position)}` : null,
    `🎫 <b>Tanlagan tarif:</b> ${PLANS[lead.plan].title} — ${formatPrice(PLANS[lead.plan].price)} so'm`,
    utmLine ? `📊 <b>Manba:</b> ${esc(utmLine)}` : null,
    `🕒 ${tashkentTime(lead.createdAt)}`,
    `🆔 <code>${lead.id}</code>`,
    ``,
    STATUS_LINE[lead.status],
  ];
  if (lead.status === "purchased" && lead.purchasedPlan) {
    lines.push(
      `💰 ${PLANS[lead.purchasedPlan].title} — ${formatPrice(PLANS[lead.purchasedPlan].price)} so'm`,
      `👨‍💼 ${esc(lead.purchasedBy || "")} · ${tashkentTime(lead.purchasedAt || Date.now())}`
    );
  }
  if (extra) lines.push(extra);
  return lines.filter((l): l is string => l !== null).join("\n");
}

type Btn = { text: string; callback_data: string };

/** callback_data formati: a:<amal>:<lidId>  (64 baytdan kam) */
export function leadKeyboard(lead: Lead): { inline_keyboard: Btn[][] } {
  if (lead.status === "purchased") return { inline_keyboard: [] };
  const rows: Btn[][] = [
    [
      { text: `✅ Standart sotib oldi`, callback_data: `b:S:${lead.id}` },
      { text: `💎 Standart+ sotib oldi`, callback_data: `b:P:${lead.id}` },
    ],
  ];
  const second: Btn[] = [];
  if (lead.status !== "contacted") second.push({ text: "📞 Bog'lanildi", callback_data: `c:${lead.id}` });
  if (lead.status !== "rejected") second.push({ text: "❌ Rad etdi", callback_data: `r:${lead.id}` });
  if (second.length) rows.push(second);
  return { inline_keyboard: rows };
}

export function confirmKeyboard(short: "S" | "P", id: string) {
  const plan = short === "S" ? PLANS.standart : PLANS.standart_plus;
  return {
    inline_keyboard: [
      [{ text: `✔️ Ha, ${plan.title} — ${formatPrice(plan.price)} so'm`, callback_data: `y:${short}:${id}` }],
      [{ text: "↩️ Ortga", callback_data: `x:${id}` }],
    ],
  };
}
