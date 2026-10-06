"use client";

import { motion, AnimatePresence, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import { EVENT, PLANS, formatPrice } from "@/lib/config";
import Logo from "../Logo";
import LeadForm from "../LeadForm";
import { useLead } from "../LeadModal";
import { ArrowIcon, CheckIcon, Eyebrow, Reveal, SplitHeading, onSpot } from "../ui";

const STD = [
  "3 kunlik praktikumga qatnashish",
  "Yozib olingan darslarga dostup — 6 oy",
  "Modul tarqatma materiallari",
  "3 kun tog‘da yashash va ovqatlanish",
  "Ishtirok etganlik sertifikati",
];
const PLUS = [
  "Kompaniyada strategiya ishlab chiqish bo‘yicha 1 oy davomida online qo‘llab-quvvatlash (Telegram, Zoom)",
  "Boshqaruv bo‘yicha yarim kunlik mini-diagnostika",
  "Ekspert bilan kechki ovqat, individual savol va masalalarga yechim topish",
  "O‘zi bilan bitta TOP menejer olib kelish",
];

export function Pricing() {
  const { open } = useLead();
  return (
    <section id="narx" className="relative overflow-hidden py-24 sm:py-32">
      <div className="hex-grid-dark absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Eyebrow>Tariflar</Eyebrow>
          </div>
          <SplitHeading text="Praktikum narxi" className="text-4xl font-extrabold tracking-tight text-brand-900 sm:text-6xl" />
        </div>

        <div className="mx-auto mt-14 grid max-w-5xl gap-5 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            onMouseMove={onSpot}
            className="card spotlight flex flex-col p-8 sm:p-10"
          >
            <div className="eyebrow text-brand-700">Standart</div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-5xl font-extrabold tracking-tight text-brand-700 sm:text-[54px]">{formatPrice(PLANS.standart.price)}</span>
              <span className="text-2xl font-extrabold text-brand-700">so‘m</span>
            </div>
            <div className="my-7 h-px bg-brand-900/10" />
            <ul className="space-y-3.5">
              {STD.map((s) => (
                <li key={s} className="flex gap-3 text-[16px] text-brand-900">
                  <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" /> {s}
                </li>
              ))}
            </ul>
            <div className="flex-1" />
            <button
              onClick={() => open("standart")}
              className="group mt-8 flex items-center justify-center gap-2 rounded-2xl border-2 border-brand-700 px-6 py-4 font-extrabold text-brand-700 transition hover:bg-brand-700 hover:text-white"
            >
              Standart tanlash <ArrowIcon className="h-5 w-5 transition group-hover:translate-x-1" />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            onMouseMove={onSpot}
            className="grain spotlight relative flex flex-col overflow-hidden rounded-[22px] bg-brand-700 p-8 text-white shadow-2xl shadow-brand-700/40 sm:p-10"
          >
            {/* aylanuvchi nur chegarasi */}
            <div className="pointer-events-none absolute -inset-[150%] -z-10 animate-spin-slow bg-[conic-gradient(from_0deg,transparent_0_70%,rgba(156,201,239,0.5)_80%,transparent_90%)]" />
            <div className="absolute inset-[1.5px] -z-10 rounded-[21px] bg-brand-700" />
            <div className="flex items-center justify-between">
              <div className="eyebrow text-brand-300">Standart+</div>
              <span className="rounded-full bg-brand-300 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-brand-900">Eng to‘liq</span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-5xl font-extrabold tracking-tight sm:text-[54px]">{formatPrice(PLANS.standart_plus.price)}</span>
              <span className="text-2xl font-extrabold">so‘m</span>
            </div>
            <div className="my-7 h-px bg-white/15" />
            <div className="mb-3.5 font-bold text-brand-300">Standart tarifidagi hammasi, qo‘shimcha:</div>
            <ul className="space-y-3.5">
              {PLUS.map((s) => (
                <li key={s} className="flex gap-3 text-[16px] text-white/90">
                  <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand-300" /> {s}
                </li>
              ))}
            </ul>
            <button
              onClick={() => open("standart_plus")}
              className="group relative mt-8 flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-white px-6 py-4 font-extrabold text-brand-800 transition hover:scale-[1.02]"
            >
              <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 animate-shine bg-gradient-to-r from-transparent via-brand-200/70 to-transparent" />
              Standart+ tanlash <ArrowIcon className="h-5 w-5 transition group-hover:translate-x-1" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section id="royxat" className="grain relative overflow-hidden bg-brand-800 py-24 text-white sm:py-32">
      <div className="hex-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_30%_50%,black,transparent_70%)]" />
      <div className="absolute -left-40 top-10 h-[500px] w-[500px] rounded-full bg-brand-500/30 blur-[120px]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <Eyebrow light>FAZZA TOP CEO Praktikum</Eyebrow>
          <SplitHeading text="Joyingizni band qiling" className="text-5xl font-extrabold tracking-tight sm:text-7xl" />
          <div className="mt-10 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {[
              ["Sana", EVENT.dateLabel],
              ["Manzil", EVENT.location],
              ["Ishtirok narxi", `${formatPrice(PLANS.standart.price)} so‘mdan`],
            ].map(([k, v], i) => (
              <Reveal key={k} delay={i * 0.08}>
                <div className="card-dark h-full p-5">
                  <div className="eyebrow !text-[11px] text-brand-300">{k}</div>
                  <div className="mt-2 text-lg font-extrabold leading-snug">{v}</div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <p className="mt-6 text-lg text-white/80">
              O‘rinlar soni cheklangan: <b className="text-brand-300">{EVENT.seats} ta kompaniya</b>
            </p>
          </Reveal>
        </div>
        <Reveal>
          <div className="rounded-[28px] bg-white p-6 text-brand-900 shadow-2xl shadow-brand-950/40 sm:p-8">
            <h3 className="mb-1 text-2xl font-extrabold">Ro‘yxatdan o‘tish</h3>
            <p className="mb-6 text-muted">Arizani qoldiring — menejerimiz siz bilan bog‘lanadi.</p>
            <LeadForm compact />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-brand-950 py-10 text-white/60">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-5 sm:flex-row sm:px-8">
        <Logo light />
        <p className="text-center text-sm">© {new Date().getFullYear()} FAZZA Management School. Barcha huquqlar himoyalangan.</p>
      </div>
    </footer>
  );
}

/** Mobil qurilmada pastdan chiqadigan CTA paneli */
export function MobileBar() {
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  const { open } = useLead();
  useMotionValueEvent(scrollY, "change", (v) => {
    const form = document.getElementById("royxat");
    const nearForm = form ? form.getBoundingClientRect().top < window.innerHeight : false;
    setShow(v > 600 && !nearForm);
  });
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed inset-x-0 bottom-0 z-40 p-3 md:hidden"
        >
          <div className="flex items-center gap-3 rounded-2xl bg-brand-900/95 p-2 pl-4 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl">
            <div className="flex-1 leading-tight text-white">
              <div className="text-[11px] font-bold uppercase tracking-wider text-brand-300">31.10.2026 · 30 o‘rin</div>
              <div className="text-sm font-extrabold">{formatPrice(PLANS.standart.price)} so‘mdan</div>
            </div>
            <button onClick={() => open()} className="rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-brand-800">
              Joy band qilish
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
