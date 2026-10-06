"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { CountUp, Eyebrow, Reveal, SplitHeading, Stagger, StaggerItem, onSpot } from "../ui";

const OUTCOMES = [
  { t: "Bosqich diagnostikasi", d: "Kompaniyangiz qayerda va keyingi bosqichga o‘tish shartlari." },
  { t: "PAEI jamoa xaritasi", d: "Kim qaysi rolda kuchli va jamoada qaysi rol yetishmaydi." },
  { t: "Kompaniya fundamenti", d: "Missiya, vizyon va qadriyatlarning ishchi versiyasi." },
  { t: "OGSM strategik reja", d: "Maqsad, o‘lchovlar, strategiyalar va ko‘rsatkichlar bir sahifada." },
  { t: "Harakatlar rejasi + KPI", d: "Strategiyani kundalik ishga aylantiruvchi mexanizm." },
  { t: "Rivojlanish yo‘l xaritasi", d: "Biznesni keyingi bosqichga olib chiqish uchun aniq qarorlar." },
];

export function Outcomes() {
  return (
    <section className="relative bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Eyebrow>Natija</Eyebrow>
        <SplitHeading text="Praktikumdan nima bilan chiqasiz" className="max-w-3xl text-4xl font-extrabold tracking-tight text-brand-900 sm:text-6xl" />
        <Stagger className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {OUTCOMES.map((o, i) => (
            <StaggerItem key={o.t}>
              <div
                onMouseMove={onSpot}
                className="spotlight group relative h-full overflow-hidden rounded-[22px] border border-brand-900/10 bg-paper p-7 transition duration-500 hover:-translate-y-1.5 hover:border-brand-700/20 hover:bg-white hover:shadow-2xl hover:shadow-brand-700/10"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold tracking-widest text-brand-600">0{i + 1}</span>
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-brand-700/15 text-brand-700 transition duration-500 group-hover:rotate-45 group-hover:bg-brand-700 group-hover:text-white">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round">
                      <path d="M7 17L17 7M9 7h8v8" />
                    </svg>
                  </span>
                </div>
                <h3 className="mt-8 text-xl font-extrabold text-brand-900">{o.t}</h3>
                <p className="mt-2 leading-relaxed text-muted">{o.d}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

const SPEAKERS = [
  {
    role: "TOP CEO mentori",
    name: "Otabek Umarov",
    img: "/images/otabek-umarov.jpg",
    bio: "Veolia Energy Tashkent — Head of Business Transformation. Strategik va moliyaviy boshqaruvda",
    years: 30,
    tags: ["UZBAT", "UzCaseMash", "IFODA", "Skolkovo", "SIBUR", "ACNielsen", "Ro‘zmetov"],
  },
  {
    role: "FAZZA TOP CEO asoschisi",
    name: "Jamoliddin Shodiev, MBA",
    img: "/images/jamoliddin-shodiev.jpg",
    bio: "FAZZA Management School asoschisi, Sejong universiteti (Koreya) MBA. Boshqaruvda",
    years: 16,
    tags: ["FAZZA TOP CEO", "EVO", "EMU", "SOF GROUP"],
  },
];

function SpeakerCard({ s, i }: { s: (typeof SPEAKERS)[number]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-30, 30]);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={onSpot}
      className="card-dark spotlight group grid gap-6 overflow-hidden p-5 sm:grid-cols-[220px_1fr] sm:p-6"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-brand-900 sm:aspect-auto sm:h-full sm:min-h-[290px]">
        <motion.div style={{ y }} className="absolute -inset-y-8 inset-x-0">
          <Image src={s.img} alt={s.name} fill sizes="(max-width: 640px) 90vw, 220px" className="object-cover transition duration-700 group-hover:scale-105" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950/50 to-transparent" />
      </div>
      <div className="flex flex-col py-1">
        <div className="eyebrow text-brand-300">{s.role}</div>
        <h3 className="mt-3 text-3xl font-extrabold leading-tight">{s.name}</h3>
        <p className="mt-3 leading-relaxed text-brand-100/80">
          {s.bio} <b className="text-white">{s.years} yillik</b> tajriba.
        </p>
        <div className="mt-5 flex items-end gap-2">
          <CountUp to={s.years} className="text-6xl font-extrabold leading-none text-brand-300" />
          <span className="pb-1.5 text-sm font-bold uppercase tracking-wider text-white/60">yil tajriba</span>
        </div>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-6">
          {s.tags.map((t) => (
            <span key={t} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/75">
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function Speakers() {
  return (
    <section id="spikerlar" className="grain relative overflow-hidden bg-brand-800 py-24 text-white sm:py-32">
      <div className="hex-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Eyebrow light>Spikerlar</Eyebrow>
        <SplitHeading text="Praktikumni kimlar olib boradi" className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-6xl" />
        <div className="mt-14 grid gap-5 lg:grid-cols-2">
          {SPEAKERS.map((s, i) => (
            <SpeakerCard key={s.name} s={s} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

const CLIENTS = ["bts", "akfa", "asaxiy", "cambridge", "qwatt", "kamolon-osh", "merit-chemicals", "bulut", "aynimo", "registon"];

export function Clients() {
  const row = [...CLIENTS, ...CLIENTS];
  return (
    <section className="relative overflow-hidden py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Eyebrow>Ishonch</Eyebrow>
        <SplitHeading text="Bizning mijozlarimiz" className="text-4xl font-extrabold tracking-tight text-brand-900 sm:text-6xl" />
      </div>
      <div className="relative mt-14 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        {[0, 1].map((r) => (
          <div key={r} className={`flex w-max gap-4 ${r === 1 ? "mt-4 [animation-direction:reverse]" : ""} animate-marquee hover:[animation-play-state:paused]`}>
            {(r === 1 ? [...row].reverse() : row).map((c, i) => (
              <div
                key={`${c}-${i}`}
                className="relative h-28 w-48 shrink-0 overflow-hidden rounded-2xl border border-brand-900/8 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:h-32 sm:w-56"
              >
                <Image src={`/images/clients/${c}.webp`} alt={c} fill sizes="224px" className="object-cover" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

const DAYS = [
  { d: "1-kun", t: "O‘zgarishlar va kompaniya fundamenti", items: ["Kompaniyada o‘zgarishlarni boshqarish", "Kompaniyaning fundamental asoslari: Missiya, Vizyon, Qadriyatlar"] },
  { d: "2-kun", t: "Hozirgi holat va maqsadlar", items: ["Kompaniyaning hozirgi holati tahlili", "Maqsadlarni belgilash"] },
  {
    d: "3-kun",
    t: "Strategiya va amalga oshirish",
    items: [
      "OGSM asosida strategiya ishlab chiqish va amalga oshirish rejasi",
      "Harakatlar rejasi va KPI tizimi",
      "Strategiyani jamoaning motivatsion tizimi bilan bog‘lash bo‘yicha amaliy yechimlar",
    ],
  },
];

export function Program() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.6"] });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="jadval" className="grain relative overflow-hidden bg-brand-900 py-24 text-white sm:py-32">
      <div className="absolute right-0 top-0 h-[600px] w-[600px] rounded-full bg-brand-600/25 blur-[140px]" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Eyebrow light>Jadval</Eyebrow>
        <SplitHeading text="3 kunlik dastur" className="text-4xl font-extrabold tracking-tight sm:text-6xl" />

        <div ref={ref} className="relative mt-16">
          {/* Vaqt chizig'i */}
          <div className="absolute left-0 right-0 top-[26px] hidden h-px bg-white/10 lg:block" />
          <motion.div style={{ scaleX: lineScale }} className="absolute left-0 right-0 top-[26px] hidden h-px origin-left bg-brand-300 lg:block" />
          <div className="absolute bottom-0 left-[26px] top-0 w-px bg-white/10 lg:hidden" />
          <motion.div style={{ scaleY: lineScale }} className="absolute bottom-0 left-[26px] top-0 w-px origin-top bg-brand-300 lg:hidden" />

          <div className="grid gap-10 lg:grid-cols-3 lg:gap-6">
            {DAYS.map((day, i) => (
              <motion.div
                key={day.d}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="relative pl-16 lg:pl-0"
              >
                <div className="absolute left-0 top-0 grid h-[53px] w-[53px] place-items-center rounded-2xl bg-brand-300 text-lg font-extrabold text-brand-900 shadow-[0_0_40px_rgba(156,201,239,0.45)] lg:relative">
                  {i + 1}
                </div>
                <div onMouseMove={onSpot} className="card-dark spotlight mt-0 h-[calc(100%-0px)] p-7 transition duration-500 hover:-translate-y-1.5 lg:mt-6 lg:h-[calc(100%-77px)]">
                  <div className="text-3xl font-extrabold text-brand-300">{day.d}</div>
                  <div className="mt-3 text-xl font-extrabold leading-snug">{day.t}</div>
                  <ul className="mt-5 space-y-3">
                    {day.items.map((it) => (
                      <li key={it} className="flex gap-3 text-white/80">
                        <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-300" />
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const AUD = [
  { t: "Biznes egalari va asoschilar", d: "Kompaniyani tizimli boshqaruvga o‘tkazmoqchi bo‘lganlar." },
  { t: "CEO va bosh direktorlar", d: "Kompaniyani keyingi bosqichga olib chiqish vazifasi turganlar." },
  { t: "Top-menejerlar", d: "Strategiyani amalga oshirish va jamoa uchun javobgarlar." },
  { t: "O‘zgarish davridagi kompaniyalar", d: "O‘sish, qayta tashkil etish yoki inqirozdan chiqish bosqichidagilar." },
];

export function Audience() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Eyebrow>Kimlar uchun</Eyebrow>
        <SplitHeading text="Dastur kimlar uchun" className="text-4xl font-extrabold tracking-tight text-brand-900 sm:text-6xl" />
        <Stagger className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {AUD.map((a, i) => (
            <StaggerItem key={a.t}>
              <div onMouseMove={onSpot} className="card spotlight group h-full p-7 transition duration-500 hover:-translate-y-1.5">
                <div className="mb-6 flex gap-1">
                  {Array.from({ length: 4 }).map((_, k) => (
                    <span key={k} className={`h-1.5 rounded-full transition-all duration-500 ${k <= i ? "w-6 bg-brand-700" : "w-3 bg-brand-200"} group-hover:w-6`} />
                  ))}
                </div>
                <h3 className="text-xl font-extrabold leading-snug text-brand-900">{a.t}</h3>
                <p className="mt-3 leading-relaxed text-muted">{a.d}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
        <Reveal>
          <div className="grain relative mt-6 flex flex-col gap-3 overflow-hidden rounded-[22px] bg-brand-700 p-7 text-white sm:flex-row sm:items-center sm:gap-8 sm:p-9">
            <span className="text-xl font-extrabold text-brand-300">Format</span>
            <span className="text-lg font-medium sm:text-xl">Nazariya emas — o‘z kompaniyangiz misolida amaliy ish, tahlil va tayyor yechimlar.</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Gallery() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-30, 30]);
  const imgs = [
    { src: "/images/gallery/gallery-1.jpg", c: "row-span-2", y: y1 },
    { src: "/images/gallery/gallery-2.jpg", c: "col-span-2 row-span-2 sm:col-span-1", y: y2 },
    { src: "/images/gallery/gallery-3.jpg", c: "", y: y1 },
    { src: "/images/gallery/gallery-4.jpg", c: "", y: y2 },
  ];
  return (
    <section className="relative bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Eyebrow>Format</Eyebrow>
        <SplitHeading text="Guruh bo‘lib amaliy mashg‘ulotlar" className="max-w-4xl text-4xl font-extrabold tracking-tight text-brand-900 sm:text-6xl" />
        <Reveal>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted sm:text-xl">
            Darslar <b className="text-brand-800">real kompaniya keyslari</b> asosida o‘tadi — tinglovchilar amalda qo‘llasa bo‘ladigan aniq instrumentlar bilan ketadi.
          </p>
        </Reveal>
        <div ref={ref} className="mt-12 grid grid-flow-row-dense auto-rows-[160px] grid-cols-2 gap-3 sm:auto-rows-[200px] sm:grid-cols-[0.75fr_1.4fr_1fr] sm:gap-4">
          {imgs.map((im, i) => (
            <motion.div
              key={im.src}
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: i * 0.1 }}
              className={`group relative overflow-hidden rounded-[22px] bg-brand-100 ${im.c} ${i === 1 ? "sm:row-span-2" : ""}`}
            >
              <motion.div style={{ y: im.y }} className="absolute -inset-y-16 inset-x-0">
                <Image src={im.src} alt="FAZZA praktikum mashg‘uloti" fill sizes="(max-width:640px) 50vw, 40vw" className="object-cover transition duration-700 group-hover:scale-105" />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
