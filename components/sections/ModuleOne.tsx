"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { CheckIcon, Eyebrow, Reveal, SplitHeading, Stagger, StaggerItem, onSpot } from "../ui";

const TOPICS = [
  "Adizes bo‘yicha PAEI modeli: boshqaruv rollari",
  "Kompaniya hayotiylik bosqichlari",
  "Keyingi bosqichga chiqish uchun organizatsion strategiyalar",
  "Samarali rahbar modeli",
];

const PAEI = [
  { l: "P", en: "Producer", uz: "Natija beruvchi", d: "Mijoz ehtiyojini qondiradi va ishni natijaga olib chiqadi." },
  { l: "A", en: "Administrator", uz: "Tizimlashtiruvchi", d: "Jarayon, tartib va nazoratni yo‘lga qo‘yadi." },
  { l: "E", en: "Entrepreneur", uz: "Tadbirkor", d: "Kelajakni ko‘radi, yangi imkoniyat va o‘zgarishlarni boshlaydi." },
  { l: "I", en: "Integrator", uz: "Birlashtiruvchi", d: "Jamoani yagona maqsad atrofida birlashtiradi." },
];

const RESULTS = [
  "Kompaniya hayotiylik bosqichidan kelib chiqib, uning yashovchanligini oshirish strategiyalari",
  "Boshqaruv rollarini (PAEI) anglab, super samarali jamoa shakllantirish",
  "Biznesdagi o‘zgarishlarni tahlil qilib, transformatsion liderlik ko‘nikmalari",
  "Samarali rahbarlikning hislatlarini amaliy mashg‘ulotlar orqali o‘zlashtirish",
  "Biznesni keyingi bosqichga olib chiqish uchun aniq yo‘l xaritasi va qarorlar",
];

// Hayotiylik egri chizig'i
const W = 1100;
const BASE = 300;
const AMP = 245;
const C = 541;
const SIG = 215;
const yAt = (x: number) => BASE - AMP * Math.exp(-((x - C) ** 2) / (2 * SIG ** 2));
const PATH = (() => {
  let d = "";
  for (let x = 0; x <= W; x += 10) d += `${x === 0 ? "M" : "L"}${x} ${yAt(x).toFixed(1)}`;
  return d;
})();

const STAGES = [
  { x: 63, n: "Orzu", d: "G‘oya va ishtiyoq bor — kompaniya hali asoschining boshida." },
  { x: 238, n: "Go‘daklik", d: "Asosiy e’tibor savdo va natijada, tizim deyarli yo‘q." },
  { x: 341, n: "Tez o‘sish", d: "Imkoniyatlar ko‘p, tartib kam — hamma narsa asoschiga bog‘liq." },
  { x: 436, n: "O‘smirlik", d: "Delegatsiya va tizimlashtirish zarurati, ichki ziddiyatlar kuchayadi." },
  { x: 541, n: "Gullab-yashnash", d: "Moslashuvchanlik va nazorat muvozanatda — eng samarali bosqich.", peak: true },
  { x: 663, n: "Barqarorlik", d: "Natija bor, ammo tadbirkorlik ruhi so‘na boshlaydi." },
  { x: 767, n: "Aristokratiya", d: "Shakl mazmundan ustun, tavakkal va yangilik kamayadi." },
  { x: 878, n: "Erta byurokratiya", d: "Muammo o‘rniga aybdor izlanadi, ichki kurash boshlanadi." },
  { x: 1020, n: "Byurokratiya", d: "Qoidalar mijozdan muhimroq bo‘lib qoladi." },
];

function Lifecycle() {
  const [active, setActive] = useState(4);
  const s = STAGES[active];
  return (
    <div className="card mt-6 overflow-hidden p-5 sm:p-10">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <h3 className="text-2xl font-extrabold text-brand-900 sm:text-3xl">Kompaniya hayotiylik bosqichlari</h3>
        <p className="text-sm font-semibold text-muted">Bosqichni tanlang ↓</p>
      </div>

      <div className="mt-6">
        <svg viewBox="-20 -40 1140 400" className="h-auto w-full">
          <defs>
            <linearGradient id="lc" x1="0" x2="1">
              <stop offset="0" stopColor="#6aa6db" />
              <stop offset="0.5" stopColor="#1a4d7a" />
              <stop offset="1" stopColor="#6aa6db" />
            </linearGradient>
            <linearGradient id="lcfill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#9cc9ef" stopOpacity="0.35" />
              <stop offset="1" stopColor="#9cc9ef" stopOpacity="0" />
            </linearGradient>
          </defs>
          <line x1="0" x2={W} y1={BASE + 22} y2={BASE + 22} stroke="#b9d3ea" strokeWidth="1.5" />
          <line x1={C} x2={C} y1={yAt(C)} y2={BASE + 22} stroke="#b9d3ea" strokeDasharray="5 6" />
          <motion.path
            d={`${PATH} L${W} ${BASE + 22} L0 ${BASE + 22}Z`}
            fill="url(#lcfill)"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 1.2 }}
          />
          <motion.path
            d={PATH}
            fill="none"
            stroke="url(#lc)"
            strokeWidth="4"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 2.2, ease: [0.65, 0, 0.35, 1] }}
          />
          <text x={C * 0.5} style={{ fontSize: 15 }} y={BASE + 58} textAnchor="middle" className="fill-muted text-[15px] font-bold tracking-[0.3em]">
            O‘SISH
          </text>
          <text x={C + (W - C) / 2} y={BASE + 58} textAnchor="middle" className="fill-muted text-[15px] font-bold tracking-[0.3em]">
            QARISH
          </text>
          {STAGES.map((st, i) => {
            const y = yAt(st.x);
            const isA = i === active;
            const right = st.x > C;
            return (
              <motion.g
                key={st.n}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.25 + (st.x / W) * 2, type: "spring", stiffness: 300, damping: 18 }}
                style={{ transformOrigin: `${st.x}px ${y}px` }}
                onMouseEnter={() => setActive(i)}
                onClick={() => setActive(i)}
                className="cursor-pointer"
              >
                <circle cx={st.x} cy={y} r="26" fill="transparent" />
                {isA && (
                  <motion.circle
                    cx={st.x}
                    cy={y}
                    r={st.peak ? 22 : 16}
                    fill="#9cc9ef"
                    initial={{ opacity: 0.6, scale: 0.6 }}
                    animate={{ opacity: [0.6, 0], scale: [0.8, 1.8] }}
                    transition={{ duration: 1.6, repeat: Infinity }}
                    style={{ transformOrigin: `${st.x}px ${y}px` }}
                  />
                )}
                <circle
                  cx={st.x}
                  cy={y}
                  r={st.peak ? 14 : isA ? 10 : 8}
                  fill={st.peak ? "#9cc9ef" : isA ? "#1a4d7a" : "#12385c"}
                  stroke={st.peak || isA ? "#12385c" : "#fff"}
                  strokeWidth={st.peak ? 3 : 2.5}
                  className="transition-all"
                />
                <text
                  x={st.peak ? st.x : i === STAGES.length - 1 ? st.x + 24 : right ? st.x + 16 : st.x - 16}
                  y={st.peak ? y - 30 : i === STAGES.length - 1 ? y + 34 : y - 16}
                  textAnchor={st.peak ? "middle" : i === STAGES.length - 1 ? "end" : right ? "start" : "end"}
                  className={`hidden sm:block text-[17px] ${st.peak ? "font-extrabold" : "font-semibold"} ${isA ? "fill-brand-700" : "fill-ink"}`}
                >
                  {st.n}
                </text>
              </motion.g>
            );
          })}
        </svg>
      </div>

      <div className="-mx-5 mt-2 flex gap-2 overflow-x-auto px-5 pb-2 sm:hidden">
        {STAGES.map((st, i) => (
          <button
            key={st.n}
            onClick={() => setActive(i)}
            className={`shrink-0 rounded-full px-3.5 py-2 text-[13px] font-bold transition ${
              i === active ? "bg-brand-700 text-white" : "bg-brand-50 text-brand-800"
            }`}
          >
            {i + 1}. {st.n}
          </button>
        ))}
      </div>
      <div className="mt-4 grid gap-4 border-t border-brand-900/10 pt-6 sm:grid-cols-[auto_1fr] sm:items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="flex items-center gap-4 sm:col-span-2"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-700 text-lg font-extrabold text-white">{active + 1}</span>
            <div>
              <div className="text-lg font-extrabold text-brand-900">{s.n}</div>
              <div className="text-muted">{s.d}</div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <p className="mt-6 rounded-2xl bg-brand-50 p-5 text-[16px] leading-relaxed text-brand-800">
        Har bir bosqichning o‘z muammolari va o‘z yechimi bor. Praktikumda kompaniyangiz qayerda ekanini aniqlaysiz va uni{" "}
        <b>Gullab-yashnash</b> bosqichiga olib chiqish yo‘lini chizasiz.
      </p>
    </div>
  );
}

export function TopicList({ items, light = true }: { items: string[]; light?: boolean }) {
  return (
    <ol className="mt-10">
      {items.map((t, i) => (
        <motion.li
          key={t}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          className={`group relative flex items-center gap-6 border-t py-5 sm:gap-10 sm:py-6 ${light ? "border-white/10" : "border-brand-900/10"}`}
        >
          <motion.span
            className={`absolute left-0 top-[-1px] h-px ${light ? "bg-brand-300" : "bg-brand-600"}`}
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.2 + i * 0.1 }}
          />
          <span className={`w-10 text-xl font-extrabold tabular-nums sm:text-2xl ${light ? "text-brand-300" : "text-brand-600"}`}>0{i + 1}</span>
          <span className={`text-lg font-semibold transition group-hover:translate-x-2 sm:text-2xl ${light ? "text-white" : "text-brand-900"}`}>{t}</span>
        </motion.li>
      ))}
    </ol>
  );
}

export function Results({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="grain relative mt-6 overflow-hidden rounded-[28px] bg-brand-700 p-7 text-white sm:p-12">
      <div className="hex-grid absolute inset-0 opacity-60" />
      <div className="relative">
        <div className="eyebrow text-brand-300">{label}</div>
        <h3 className="mt-3 text-3xl font-extrabold sm:text-5xl">Qanday ko‘nikma va instrumentlar olasiz</h3>
        <ul className="mt-8 grid gap-3">
          {items.map((r, i) => (
            <motion.li
              key={r}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:bg-white/[0.08] sm:p-5"
            >
              <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-300 text-brand-900">
                <CheckIcon className="h-4 w-4" />
              </span>
              <span className="text-[16px] font-medium leading-relaxed text-white/90 sm:text-lg">{r}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function ModuleOne() {
  return (
    <>
      <section id="modul-1" className="grain relative overflow-hidden bg-brand-800 py-24 text-white sm:py-32">
        <div className="hex-grid absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />
        <div className="absolute -right-40 top-0 h-[500px] w-[500px] rounded-full bg-brand-500/30 blur-[120px]" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <Eyebrow light>Modul 1</Eyebrow>
          <SplitHeading text="Kompaniyada o‘zgarishlarni boshqarish" className="max-w-4xl text-4xl font-extrabold tracking-tight sm:text-6xl" />
          <TopicList items={TOPICS} />
        </div>
      </section>

      <section className="relative py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <h3 className="max-w-3xl text-3xl font-extrabold tracking-tight text-brand-900 sm:text-5xl">PAEI: kompaniyaga kerak 4 boshqaruv roli</h3>
          </Reveal>
          <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PAEI.map((r) => (
              <StaggerItem key={r.l}>
                <div
                  onMouseMove={onSpot}
                  className="card spotlight group relative h-full overflow-hidden p-7 transition duration-500 hover:-translate-y-2 hover:bg-brand-700"
                >
                  <span className="pointer-events-none absolute -bottom-14 -right-3 text-[180px] font-extrabold leading-none text-brand-900/[0.035] transition duration-700 group-hover:scale-110 group-hover:text-white/[0.06]">
                    {r.l}
                  </span>
                  <div className="text-7xl font-extrabold leading-none text-brand-700 transition group-hover:text-brand-300">{r.l}</div>
                  <div className="mt-6 text-xl font-extrabold text-brand-900 transition group-hover:text-white">{r.en}</div>
                  <div className="mt-1 text-sm font-bold text-brand-600 transition group-hover:text-brand-300">{r.uz}</div>
                  <p className="mt-3 leading-relaxed text-muted transition group-hover:text-brand-100/85">{r.d}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal>
            <p className="mt-8 max-w-4xl text-lg font-bold text-brand-800 sm:text-xl">
              Hech bir rahbar to‘rtala rolni birdek mukammal bajara olmaydi — shuning uchun rollar to‘g‘ri taqsimlangan jamoa kerak.
            </p>
          </Reveal>

          <Reveal>
            <Lifecycle />
          </Reveal>
          <Results label="Modul 1 natijalari" items={RESULTS} />
        </div>
      </section>
    </>
  );
}
