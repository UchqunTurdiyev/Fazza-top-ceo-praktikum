import { NextRequest, NextResponse } from "next/server";
import { tg } from "@/lib/telegram";
import { storeIsPersistent } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Deploy'dan keyin bir marta oching:
 *   https://SAYTINGIZ.uz/api/telegram/setup?key=ADMIN_SECRET
 * Bu Telegram webhook'ni saytingizga ulaydi.
 */
export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  if (!process.env.ADMIN_SECRET || key !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ ok: false, error: "key noto'g'ri" }, { status: 401 });
  }

  const base = (process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin).replace(/\/$/, "");
  const url = `${base}/api/telegram/webhook`;

  const set = await tg("setWebhook", {
    url,
    secret_token: process.env.TELEGRAM_WEBHOOK_SECRET || undefined,
    allowed_updates: ["message", "callback_query"],
    drop_pending_updates: true,
  });
  const info = await tg("getWebhookInfo", {});

  return NextResponse.json({
    webhook: url,
    setWebhook: set,
    info,
    checks: {
      telegramToken: Boolean(process.env.TELEGRAM_BOT_TOKEN),
      chatId: Boolean(process.env.TELEGRAM_CHAT_ID),
      pixelId: Boolean(process.env.NEXT_PUBLIC_META_PIXEL_ID),
      capiToken: Boolean(process.env.META_CAPI_ACCESS_TOKEN),
      redis: storeIsPersistent,
    },
  });
}
