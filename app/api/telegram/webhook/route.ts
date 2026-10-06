import { NextRequest, NextResponse } from "next/server";
import { PLANS, planFromShort } from "@/lib/config";
import { acquireOnce, getLead, releaseOnce, saveLead, type Lead } from "@/lib/store";
import { sendPurchaseEvent } from "@/lib/capi";
import { adminChatIds, confirmKeyboard, esc, leadKeyboard, leadText, tg } from "@/lib/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type TgUser = { id: number; first_name?: string; last_name?: string; username?: string };
type TgMessage = { message_id: number; chat: { id: number; type: string; title?: string }; text?: string; from?: TgUser };
type Update = {
  message?: TgMessage;
  callback_query?: { id: string; from: TgUser; message?: TgMessage; data?: string };
};

const who = (u: TgUser) => (u.username ? `@${u.username}` : [u.first_name, u.last_name].filter(Boolean).join(" ") || String(u.id));

/** Lid holati o'zgarganda — barcha admin chatlardagi xabarni yangilaymiz */
async function refreshAll(lead: Lead, extra?: string) {
  await Promise.all(
    (lead.tgMessages || []).map((m) =>
      tg("editMessageText", {
        chat_id: m.chatId,
        message_id: m.messageId,
        text: leadText(lead, extra),
        parse_mode: "HTML",
        reply_markup: leadKeyboard(lead),
        disable_web_page_preview: true,
      })
    )
  );
}

export async function POST(req: NextRequest) {
  // Webhook himoyasi: faqat Telegram'dan kelgan so'rovlar
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (secret && req.headers.get("x-telegram-bot-api-secret-token") !== secret) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const update = (await req.json().catch(() => ({}))) as Update;

  // /start yoki /id — chat ID ni bilish uchun yordamchi
  if (update.message?.text && /^\/(start|id)/.test(update.message.text)) {
    const c = update.message.chat;
    await tg("sendMessage", {
      chat_id: c.id,
      parse_mode: "HTML",
      text: `👋 FAZZA TOP CEO lid boti.\n\nBu chat ID: <code>${c.id}</code>\nUni <b>TELEGRAM_CHAT_ID</b> ga qo'ying.`,
    });
    return NextResponse.json({ ok: true });
  }

  const cq = update.callback_query;
  if (!cq?.data || !cq.message) return NextResponse.json({ ok: true });

  const answer = (text: string, alert = false) => tg("answerCallbackQuery", { callback_query_id: cq.id, text, show_alert: alert });

  // Faqat ruxsat etilgan chatlardan
  const chatId = String(cq.message.chat.id);
  if (adminChatIds.length && !adminChatIds.includes(chatId)) {
    await answer("Ruxsat yo'q", true);
    return NextResponse.json({ ok: true });
  }

  const parts = cq.data.split(":");
  const action = parts[0];
  const id = parts[parts.length - 1];
  const lead = await getLead(id);
  if (!lead) {
    await answer("Lid topilmadi (baza ulanmagan yoki muddati o'tgan)", true);
    return NextResponse.json({ ok: true });
  }

  const msgRef = { chat_id: chatId, message_id: cq.message.message_id };

  switch (action) {
    // 1-qadam: "Sotib oldi" bosildi → tasdiqlash so'raymiz (adashib bosilmasligi uchun)
    case "b": {
      if (lead.status === "purchased") {
        await answer("Bu lid allaqachon sotib olgan deb belgilangan");
        break;
      }
      const short = parts[1] === "P" ? "P" : "S";
      await tg("editMessageReplyMarkup", { ...msgRef, reply_markup: confirmKeyboard(short, id) });
      await answer("Tasdiqlang");
      break;
    }

    // Ortga
    case "x": {
      await tg("editMessageReplyMarkup", { ...msgRef, reply_markup: leadKeyboard(lead) });
      await answer("Bekor qilindi");
      break;
    }

    // 2-qadam: tasdiqlandi → Meta CAPI Purchase
    case "y": {
      const plan = planFromShort(parts[1]);
      if (!plan) break;
      const lockKey = `lock:purchase:${id}`;
      if (!(await acquireOnce(lockKey))) {
        await answer("Purchase allaqachon yuborilgan ✅");
        break;
      }
      const capi = await sendPurchaseEvent(lead, plan);
      if (!capi.ok && !capi.skipped) {
        await releaseOnce(lockKey); // qayta urinish mumkin bo'lsin
        await answer(`Meta xatosi: ${capi.error}`.slice(0, 190), true);
        await tg("editMessageReplyMarkup", { ...msgRef, reply_markup: leadKeyboard(lead) });
        break;
      }
      lead.status = "purchased";
      lead.purchasedPlan = plan;
      lead.purchasedAt = Date.now();
      lead.purchasedBy = who(cq.from);
      await saveLead(lead);
      const metaLine = capi.ok
        ? `📡 Meta CAPI: <b>Purchase yuborildi</b> (${PLANS[plan].price.toLocaleString("ru-RU")} UZS)`
        : `⚠️ Meta CAPI sozlanmagan — Purchase yuborilmadi`;
      await refreshAll(lead, metaLine);
      await answer(capi.ok ? "✅ Sotib oldi — Metaga yuborildi" : "Belgilandi (CAPI sozlanmagan)");
      break;
    }

    case "c": {
      if (lead.status !== "purchased") {
        lead.status = "contacted";
        await saveLead(lead);
        await refreshAll(lead, `☎️ ${esc(who(cq.from))} bog'landi`);
      }
      await answer("Bog'lanildi deb belgilandi");
      break;
    }

    case "r": {
      if (lead.status !== "purchased") {
        lead.status = "rejected";
        await saveLead(lead);
        await refreshAll(lead, `🙅 ${esc(who(cq.from))} belgiladi`);
      }
      await answer("Rad etdi deb belgilandi");
      break;
    }

    default:
      await answer("Noma'lum amal");
  }

  return NextResponse.json({ ok: true });
}
