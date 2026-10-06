import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { PLANS, type PlanId } from "@/lib/config";
import { saveLead, rateLimit, type Lead } from "@/lib/store";
import { sendLeadEvent } from "@/lib/capi";
import { adminChatIds, leadKeyboard, leadText, tg } from "@/lib/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const clean = (v: unknown, max = 120) => (typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, max) : "");

function normalizePhone(raw: string) {
  let d = raw.replace(/\D/g, "");
  if (d.length === 9) d = "998" + d;
  return d;
}

function getIp(req: NextRequest) {
  const xff = req.headers.get("x-forwarded-for");
  return (xff?.split(",")[0] || req.headers.get("x-real-ip") || "").trim();
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Noto'g'ri so'rov" }, { status: 400 });
  }

  // Honeypot — botlar uchun yashirin maydon
  if (clean(body.website)) return NextResponse.json({ ok: true, id: "x", eventId: "x" });

  const name = clean(body.name, 80);
  const phone = normalizePhone(clean(body.phone, 30));
  const company = clean(body.company, 120);
  const position = clean(body.position, 80);
  const plan = (Object.keys(PLANS).includes(String(body.plan)) ? body.plan : "standart") as PlanId;

  if (name.length < 2) return NextResponse.json({ ok: false, error: "Ismingizni kiriting" }, { status: 422 });
  if (!/^998\d{9}$/.test(phone))
    return NextResponse.json({ ok: false, error: "Telefon raqam noto'g'ri" }, { status: 422 });

  const ip = getIp(req);
  if (ip && !(await rateLimit(ip))) {
    return NextResponse.json({ ok: false, error: "Juda ko'p urinish. Birozdan so'ng qayta urinib ko'ring." }, { status: 429 });
  }

  const utmRaw = (body.utm && typeof body.utm === "object" ? body.utm : {}) as Record<string, unknown>;
  const utm: Record<string, string> = {};
  for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
    const v = clean(utmRaw[k], 100);
    if (v) utm[k] = v;
  }

  // Lid ID frontendda yaratiladi (Pixel eventID bilan bir xil bo'lishi uchun); bo'lmasa — serverda
  const clientId = clean(body.leadId, 32);
  const id = /^[a-zA-Z0-9]{8,32}$/.test(clientId) ? clientId : crypto.randomBytes(6).toString("hex");

  const lead: Lead = {
    id,
    createdAt: Date.now(),
    name,
    phone,
    company,
    position,
    plan,
    ip: ip || undefined,
    ua: req.headers.get("user-agent") || undefined,
    fbp: clean(body.fbp, 200) || undefined,
    fbc: clean(body.fbc, 400) || undefined,
    sourceUrl: clean(body.sourceUrl, 500) || req.headers.get("referer") || undefined,
    utm,
    status: "new",
    tgMessages: [],
  };

  // 1) Telegramga yuborish (har bir admin chatga)
  const sent = await Promise.all(
    adminChatIds.map((chatId) =>
      tg<{ message_id: number }>("sendMessage", {
        chat_id: chatId,
        text: leadText(lead),
        parse_mode: "HTML",
        reply_markup: leadKeyboard(lead),
        disable_web_page_preview: true,
      }).then((r) => (r.ok && r.result ? { chatId, messageId: r.result.message_id } : null))
    )
  );
  lead.tgMessages = sent.filter((x): x is { chatId: string; messageId: number } => Boolean(x));

  // 2) Saqlash va 3) Meta CAPI Lead — parallel
  const [, capi] = await Promise.allSettled([saveLead(lead), sendLeadEvent(lead)]);
  if (capi.status === "fulfilled" && !capi.value.ok && !capi.value.skipped) {
    console.error("[CAPI Lead]", capi.value.error);
  }

  if (!lead.tgMessages.length) console.error("[Telegram] Lid yuborilmadi — token/chat ID ni tekshiring");

  return NextResponse.json({ ok: true, id });
}
