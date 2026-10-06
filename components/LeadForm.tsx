"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, type FormEvent } from "react";
import { PLANS, formatPrice, type PlanId } from "@/lib/config";
import { getAttribution, newLeadId, track } from "@/lib/pixel";
import { ArrowIcon, CheckIcon } from "./ui";

function maskPhone(raw: string) {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("998")) d = d.slice(3);
  d = d.slice(0, 9);
  const p = [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean);
  let out = "+998";
  if (p[0]) out += ` (${p[0]}${p[0].length === 2 ? ")" : ""}`;
  if (p[1]) out += ` ${p[1]}`;
  if (p[2]) out += `-${p[2]}`;
  if (p[3]) out += `-${p[3]}`;
  return out;
}

const field =
  "peer w-full rounded-2xl border border-brand-900/10 bg-white px-4 pb-2.5 pt-6 text-[15px] font-semibold text-brand-900 outline-none transition placeholder:text-transparent focus:border-brand-500 focus:ring-4 focus:ring-brand-300/30";
const label =
  "pointer-events-none absolute left-4 top-4 origin-left text-[15px] font-medium text-muted transition-all peer-focus:top-2 peer-focus:text-[11px] peer-focus:text-brand-600 peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[11px]";

export default function LeadForm({
  defaultPlan = "standart",
  onDone,
  compact = false,
}: {
  defaultPlan?: PlanId;
  onDone?: () => void;
  compact?: boolean;
}) {
  const [plan, setPlan] = useState<PlanId>(defaultPlan);
  const [phone, setPhone] = useState("+998");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === "loading") return;
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const digits = phone.replace(/\D/g, "");
    if (name.length < 2) return (setError("Ismingizni kiriting"), setState("error"));
    if (digits.length !== 12) return (setError("Telefon raqamni to'liq kiriting"), setState("error"));

    setState("loading");
    setError("");
    const leadId = newLeadId();
    const { fbp, fbc, utm } = getAttribution();

    try {
      const r = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId,
          name,
          phone: digits,
          company: fd.get("company"),
          position: fd.get("position"),
          website: fd.get("website"), // honeypot
          plan,
          fbp,
          fbc,
          utm,
          sourceUrl: window.location.href,
        }),
      });
      const j = await r.json();
      if (!r.ok || !j.ok) throw new Error(j.error || "Xatolik yuz berdi");

      // Pixel — CAPI bilan bir xil eventID (deduplikatsiya)
      track(
        "Lead",
        { content_name: "FAZZA TOP CEO Praktikum", content_category: PLANS[plan].title, value: PLANS[plan].price, currency: "UZS" },
        `lead_${j.id}`
      );
      setState("done");
    } catch (err) {
      setError((err as Error).message || "Internet aloqasini tekshirib, qayta urinib ko'ring");
      setState("error");
    }
  }

  return (
    <AnimatePresence mode="wait">
      {state === "done" ? (
        <motion.div
          key="done"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center py-8 text-center"
        >
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
            className="relative mb-6 grid h-20 w-20 place-items-center rounded-full bg-brand-700 text-white"
          >
            <span className="absolute inset-0 animate-ping rounded-full bg-brand-400/40" />
            <CheckIcon className="relative h-10 w-10" />
          </motion.div>
          <h3 className="text-2xl font-extrabold text-brand-900">Arizangiz qabul qilindi!</h3>
          <p className="mt-3 max-w-sm text-muted">
            Menejerimiz tez orada siz bilan bog&apos;lanib, joyingizni tasdiqlaydi. Telefoningiz yoningizda bo&apos;lsin.
          </p>
          {onDone && (
            <button onClick={onDone} className="mt-7 rounded-full bg-brand-50 px-6 py-3 text-sm font-bold text-brand-700 transition hover:bg-brand-100">
              Yopish
            </button>
          )}
        </motion.div>
      ) : (
        <motion.form key="form" onSubmit={submit} noValidate className="space-y-3" exit={{ opacity: 0, y: -10 }}>
          {/* Tarif tanlash */}
          <div className="grid grid-cols-2 gap-2 rounded-2xl bg-brand-50 p-1.5">
            {(Object.keys(PLANS) as PlanId[]).map((id) => (
              <button
                type="button"
                key={id}
                onClick={() => setPlan(id)}
                className={`relative rounded-xl px-3 py-2.5 text-left transition ${plan === id ? "text-white" : "text-brand-800 hover:bg-white/60"}`}
              >
                {plan === id && (
                  <motion.span
                    layoutId={compact ? "plan-pill-c" : "plan-pill"}
                    className="absolute inset-0 rounded-xl bg-brand-700 shadow-lg shadow-brand-700/30"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative block text-[13px] font-extrabold">{PLANS[id].title}</span>
                <span className={`relative block text-[12px] font-semibold ${plan === id ? "text-brand-200" : "text-muted"}`}>
                  {formatPrice(PLANS[id].price)} so&apos;m
                </span>
              </button>
            ))}
          </div>

          <div className="relative">
            <input id={`n-${compact}`} name="name" className={field} placeholder="Ism" autoComplete="name" required />
            <label htmlFor={`n-${compact}`} className={label}>
              Ism va familiya *
            </label>
          </div>
          <div className="relative">
            <input
              id={`p-${compact}`}
              name="phone"
              inputMode="tel"
              autoComplete="tel"
              className={field}
              placeholder="Telefon"
              value={phone}
              onChange={(e) => {
                let v = e.target.value;
                const prevDigits = phone.replace(/\D/g, "");
                // O'chirishda faqat belgi (")", "-") o'chgan bo'lsa — oxirgi raqamni ham o'chiramiz
                if (v.length < phone.length && v.replace(/\D/g, "") === prevDigits) v = prevDigits.length > 3 ? prevDigits.slice(0, -1) : "";
                setPhone(maskPhone(v));
              }}
            />
            <label htmlFor={`p-${compact}`} className={`${label} !top-2 !text-[11px]`}>
              Telefon raqam *
            </label>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="relative">
              <input id={`c-${compact}`} name="company" className={field} placeholder="Kompaniya" autoComplete="organization" />
              <label htmlFor={`c-${compact}`} className={label}>
                Kompaniya nomi
              </label>
            </div>
            <div className="relative">
              <input id={`l-${compact}`} name="position" className={field} placeholder="Lavozim" autoComplete="organization-title" />
              <label htmlFor={`l-${compact}`} className={label}>
                Lavozimingiz
              </label>
            </div>
          </div>
          {/* honeypot */}
          <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

          <AnimatePresence>
            {state === "error" && error && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={state === "loading"}
            className="group relative mt-1 flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-brand-700 px-6 py-4 text-[16px] font-extrabold text-white shadow-xl shadow-brand-700/30 transition hover:bg-brand-800 disabled:opacity-80"
          >
            <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 animate-shine bg-gradient-to-r from-transparent via-white/25 to-transparent" />
            {state === "loading" ? (
              <>
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" /> Yuborilmoqda...
              </>
            ) : (
              <>
                Joyimni band qilish <ArrowIcon className="h-5 w-5 transition group-hover:translate-x-1" />
              </>
            )}
          </button>
          <p className="text-center text-[12px] text-muted">Ma&apos;lumotlaringiz faqat siz bilan bog&apos;lanish uchun ishlatiladi.</p>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
