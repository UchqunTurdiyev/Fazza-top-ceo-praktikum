# FAZZA TOP CEO Praktikum — landing

Next.js 15 (App Router) · Tailwind v4 · Framer Motion · Telegram bot · Meta Pixel + CAPI · Upstash Redis

## Qanday ishlaydi

```
Forma to'ldiriladi
 ├─ Pixel: Lead (eventID = lead_<id>)
 └─ /api/lead
     ├─ Telegram: lid xabari + tugmalar
     ├─ Redis: lid saqlanadi (fbp, fbc, IP, UA, UTM)
     └─ CAPI: Lead (event_id = lead_<id>) → Pixel bilan deduplikatsiya

Telegramda "✅ Standart sotib oldi" / "💎 Standart+ sotib oldi"
 └─ "✔️ Ha" (tasdiqlash — adashib bosilmasligi uchun)
     └─ /api/telegram/webhook
         ├─ CAPI: Purchase (value 14 900 000 / 24 900 000 UZS, event_id = purchase_<id>)
         ├─ Ikki marta yuborilmaydi (Redis lock)
         └─ Xabar yangilanadi: "✅ SOTIB OLDI · @operator · vaqt"
```

Qo'shimcha tugmalar: **📞 Bog'lanildi**, **❌ Rad etdi** (faqat holatni belgilaydi).

## O'rnatish

```bash
npm install
cp .env.example .env.local   # qiymatlarni to'ldiring
npm run dev
```

## Vercel'ga deploy

1. GitHub'ga push qiling → Vercel'da Import.
2. **Storage → Upstash for Redis** ni loyihaga ulang (env avtomatik qo'shiladi). Redis'siz "Sotib oldi" tugmasi ishlamaydi.
3. `.env.example` dagi qolgan o'zgaruvchilarni Settings → Environment Variables'ga kiriting → Redeploy.
4. Telegram webhook'ni ulash — brauzerda bir marta oching:
   `https://SAYTINGIZ/api/telegram/setup?key=ADMIN_SECRET`
   Javobda `checks` bo'limida hammasi `true` bo'lishi kerak.

### Chat ID ni bilish
Botni guruhga qo'shing va guruhda `/id` yozing — bot chat ID ni yuboradi. Uni `TELEGRAM_CHAT_ID` ga qo'ying (bir nechta bo'lsa vergul bilan).

### CAPI token
Events Manager → Pixel → Settings → Conversions API → **Generate access token**.
Test qilish: `META_TEST_EVENT_CODE` ni kiriting, forma yuboring va Telegramda "Sotib oldi" bosing → Test events'da Lead (Browser + Server, deduplicated) va Purchase (Server) ko'rinadi. Keyin kodni o'chiring.

## Tahrirlash
- Sana, manzil, o'rinlar, narxlar: `lib/config.ts`
- Bo'limlar matni: `components/sections/*`
- Rasmlar: `public/images/*`
