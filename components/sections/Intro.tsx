"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { LogoMark } from "../Logo";
import { Eyebrow, Reveal, SplitHeading, Stagger, StaggerItem, onSpot } from "../ui";

const PAINS = [
  {
    t: "Hamma qaror sizga bog'langan, o't o'chiruvchisiz",
    d: "Jamoa har bir masala bilan sizga keladi, siz esa operatsion ishlarga ko'milib qolasiz.",
    i: (
      <path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5.3 1.5 1 2.5 2 2.5 0-3-1-5 1-8z" />
    ),
  },
  {
    t: "Kompaniya o'smoqda, tartib esa yo'q",
    d: "Yangi odamlar, yangi jarayonlar — lekin boshqaruv tizimi ularga yetib ulgurmayapti.",
    i: <path d="M3 17l5-5 4 4 8-9M15 7h5v5" />,
  },
  {
    t: "Strategiya faqat sizning boshingizda",
    d: "Jamoa kompaniya qayerga ketayotganini va nima uchun ishlayotganini aniq tushunmaydi.",
    i: (
      <>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="12" cy="12" r="0.8" fill="currentColor" />
      </>
    ),
  },
  {
    t: "O'zgarishlar qarshilikka uchraydi",
    d: "Har bir yangilik sekin kechadi, odamlar yana eski usullarga qaytadi.",
    i: <path d="M4 12a8 8 0 1 1 2.3 5.6M4 12V7M4 12h5" />,
  },
];

export function Pains() {
  return (
    <section id="muammolar" className="relative overflow-hidden py-24 sm:py-32">
      <div className="hex-grid-dark absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Eyebrow>Diagnostika</Eyebrow>
        <SplitHeading text="Bu holatlar sizga tanishmi?" className="max-w-3xl text-4xl font-extrabold tracking-tight text-brand-900 sm:text-6xl" />
        <Stagger className="mt-14 grid gap-5 md:grid-cols-2">
          {PAINS.map((p, i) => (
            <StaggerItem key={p.t}>
              <div
                onMouseMove={onSpot}
                className="card spotlight group relative h-full overflow-hidden p-7 transition duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-brand-700/15 sm:p-9"
              >
                <span className="absolute right-6 top-5 text-7xl font-extrabold text-brand-900/[0.04] transition group-hover:text-brand-700/10">
                  0{i + 1}
                </span>
                <span className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-700 transition duration-500 group-hover:rotate-[-8deg] group-hover:bg-brand-700 group-hover:text-white">
                  <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
                    {p.i}
                  </svg>
                </span>
                <h3 className="text-xl font-extrabold leading-snug text-brand-900 sm:text-2xl">{p.t}</h3>
                <p className="mt-3 text-[16px] leading-relaxed text-muted">{p.d}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function Word({ children, range, progress }: { children: string; range: [number, number]; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const y = useTransform(progress, range, [8, 0]);
  return (
    <motion.span style={{ opacity, y }} className="inline-block">
      {children}&nbsp;
    </motion.span>
  );
}

/** Scroll bilan so'zma-so'z yorishadigan katta iqtibos */
export function Statement() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = "Kompaniya o‘z rahbaridan tezroq o‘sa olmaydi.".split(" ");
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-30, 0]);

  return (
    <section className="relative bg-white py-28 sm:py-40">
      <div ref={ref} className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div style={{ scale, rotate }} className="mb-10 inline-grid h-20 w-20 place-items-center rounded-3xl bg-brand-700 text-white shadow-2xl shadow-brand-700/30">
          <LogoMark className="h-11 w-11" />
        </motion.div>
        <p className="text-[42px] font-extrabold leading-[1.05] tracking-[-0.03em] text-brand-700 sm:text-7xl lg:text-[88px]">
          {words.map((w, i) => (
            <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
              {w}
            </Word>
          ))}
        </p>
        <Reveal delay={0.1}>
          <p className="mt-10 max-w-2xl text-xl leading-relaxed text-brand-800/80 sm:text-2xl">
            <b className="text-brand-800">TOP CEO Praktikum</b> — rahbarning o&apos;zini va boshqaruv tizimini keyingi bosqichga olib chiqish uchun.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export function Modules() {
  const mods = [
    {
      n: "Modul 1",
      t: "Kompaniyada o‘zgarishlarni boshqarish",
      d: "Kompaniyangiz qaysi bosqichda ekanini aniqlab, jamoa va boshqaruvni aynan shu bosqichga moslaysiz.",
      href: "#modul-1",
    },
    {
      n: "Modul 2",
      t: "Strategik boshqaruv",
      d: "Missiyadan KPI gacha — o‘lchanadigan strategiya va uni amalga oshirish mexanizmini qurasiz.",
      href: "#modul-2",
    },
  ];
  return (
    <section id="dastur" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <Eyebrow>Dastur</Eyebrow>
            <SplitHeading text="Bitta dastur — ikki kuchli yo‘nalish" className="max-w-3xl text-4xl font-extrabold tracking-tight text-brand-900 sm:text-6xl" />
          </div>
          <Reveal>
            <div className="flex flex-wrap gap-2">
              {["3 kun", "Amaliy format", "O‘z kompaniyangiz misolida"].map((t) => (
                <span key={t} className="rounded-full border border-brand-700/15 bg-white px-4 py-2 text-sm font-bold text-brand-800">
                  {t}
                </span>
              ))}
            </div>
          </Reveal>
        </div>

        <Stagger className="mt-14 grid gap-5 lg:grid-cols-2">
          {mods.map((m, i) => (
            <StaggerItem key={m.n}>
              <a
                href={m.href}
                onMouseMove={onSpot}
                className={`spotlight group relative flex h-full min-h-[320px] flex-col justify-between overflow-hidden rounded-[28px] p-8 transition duration-500 hover:-translate-y-1.5 sm:p-11 ${
                  i === 0 ? "card" : "grain bg-brand-700 text-white shadow-2xl shadow-brand-700/30"
                }`}
              >
                <span
                  className={`pointer-events-none absolute -bottom-10 -right-4 text-[220px] font-extrabold leading-none tracking-tighter transition duration-700 group-hover:-translate-y-3 ${
                    i === 0 ? "text-brand-900/[0.045]" : "text-white/[0.07]"
                  }`}
                >
                  0{i + 1}
                </span>
                <div>
                  <div className={`eyebrow ${i === 0 ? "text-brand-600" : "text-brand-300"}`}>{m.n}</div>
                  <h3 className={`mt-5 max-w-md text-3xl font-extrabold leading-tight sm:text-4xl ${i === 0 ? "text-brand-900" : ""}`}>{m.t}</h3>
                  <p className={`mt-4 max-w-md text-[17px] leading-relaxed ${i === 0 ? "text-muted" : "text-brand-100/80"}`}>{m.d}</p>
                </div>
                <span
                  className={`mt-10 inline-flex w-fit items-center gap-2 rounded-full px-5 py-2.5 text-sm font-extrabold transition group-hover:gap-3 ${
                    i === 0 ? "bg-brand-50 text-brand-700" : "bg-white/10 text-white"
                  }`}
                >
                  Batafsil
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.4}>
                    <path d="M12 5v14M6 13l6 6 6-6" />
                  </svg>
                </span>
              </a>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
