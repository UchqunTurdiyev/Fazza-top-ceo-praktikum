"use client";

import { motion, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { EVENT } from "@/lib/config";
import { LogoMark } from "../Logo";
import { useLead } from "../LeadModal";
import { ArrowIcon } from "../ui";

const EASE = [0.22, 1, 0.36, 1] as const;

function useCountdown(target: string) {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const t = new Date(target).getTime();
    const tick = () => setLeft(Math.max(0, t - Date.now()));
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, [target]);
  if (left === null) return null;
  const s = Math.floor(left / 1000);
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}

function Countdown() {
  const c = useCountdown(EVENT.startISO);
  const items: [string, number | undefined][] = [
    ["kun", c?.d],
    ["soat", c?.h],
    ["daqiqa", c?.m],
    ["soniya", c?.s],
  ];
  return (
    <div className="flex gap-2 sm:gap-3">
      {items.map(([l, v]) => (
        <div key={l} className="card-dark min-w-[64px] px-3 py-2.5 text-center sm:min-w-[76px]">
          <div className="text-2xl font-extrabold tabular-nums text-white sm:text-3xl">{v === undefined ? "--" : String(v).padStart(2, "0")}</div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-brand-300">{l}</div>
        </div>
      ))}
    </div>
  );
}

function Hex({ size, className = "", stroke = 1 }: { size: number; className?: string; stroke?: number }) {
  // Tik turgan oltiburchak
  const r = size / 2;
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    return `${r + r * Math.cos(a)},${r + r * Math.sin(a)}`;
  }).join(" ");
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className} fill="none">
      <polygon points={pts} stroke="currentColor" strokeWidth={stroke} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export default function Hero() {
  const { open } = useLead();
  const ref = useRef<HTMLElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const rx = useTransform(sy, [-1, 1], [10, -10]);
  const ry = useTransform(sx, [-1, 1], [-12, 12]);
  const tx = useTransform(sx, [-1, 1], [-18, 18]);
  const ty = useTransform(sy, [-1, 1], [-18, 18]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yText = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
        my.set(((e.clientY - r.top) / r.height) * 2 - 1);
      }}
      className="grain relative isolate min-h-[100svh] overflow-hidden bg-brand-800 pb-16 pt-28 text-white sm:pt-32 lg:pb-24"
    >
      {/* Fon qatlamlari */}
      <div className="hex-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_70%_40%,black,transparent_75%)]" />
      <div className="absolute -left-40 top-20 -z-10 h-[520px] w-[520px] rounded-full bg-brand-500/30 blur-[120px]" />
      <div className="absolute -right-20 bottom-0 -z-10 h-[460px] w-[460px] rounded-full bg-brand-300/20 blur-[120px]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-b from-transparent to-brand-900/60" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-6">
        <motion.div style={{ y: yText, opacity: fade }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
            className="mb-7 inline-flex max-w-full items-center gap-2.5 whitespace-nowrap rounded-full border border-white/15 bg-white/5 py-1.5 pl-1.5 pr-4 backdrop-blur"
          >
            <span className="relative flex h-6 items-center rounded-full bg-brand-300 px-2.5 text-[11px] font-extrabold uppercase tracking-wider text-brand-900">
              <span className="mr-1.5 h-1.5 w-1.5 animate-pulse rounded-full bg-brand-800" /> Qabul ochiq
            </span>
            <span className="eyebrow !text-[11px] !tracking-[0.2em] text-brand-200">
              <span className="hidden sm:inline">FAZZA · </span>3 kunlik amaliy dastur
            </span>
          </motion.div>

          <h1 className="text-[50px] font-extrabold leading-[0.95] tracking-[-0.035em] sm:text-7xl lg:text-[76px] xl:text-[88px]">
            {["FAZZA TOP CEO", "Praktikum"].map((line, i) => (
              <span key={line} className="block overflow-hidden pb-2">
                <motion.span
                  className={`block ${i === 1 ? "text-gradient" : ""}`}
                  initial={{ y: "105%", rotate: 2 }}
                  animate={{ y: "0%", rotate: 0 }}
                  transition={{ duration: 1, ease: EASE, delay: 0.3 + i * 0.12 }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.6 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-brand-100/85 sm:text-xl"
          >
            Kompaniyada o&apos;zgarishlarni samarali boshqarish va strategik boshqaruv — o&apos;z kompaniyangiz misolida.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.75 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <button
              onClick={() => open()}
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-white px-8 py-4 text-[16px] font-extrabold text-brand-800 shadow-2xl shadow-brand-950/40 transition hover:scale-[1.02]"
            >
              <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 animate-shine bg-gradient-to-r from-transparent via-brand-200/70 to-transparent" />
              Joyingizni band qiling
              <ArrowIcon className="h-5 w-5 transition group-hover:translate-x-1" />
            </button>
            <a
              href="#dastur"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-8 py-4 font-bold text-white transition hover:bg-white/10"
            >
              Dastur bilan tanishish
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.95 }}
            className="mt-10 flex flex-col gap-6 xl:flex-row xl:items-center"
          >
            <Countdown />
            <div className="grid gap-2 text-sm">
              <div className="flex items-center gap-2.5 text-white/85">
                <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 h-[18px] w-[18px] text-brand-300" fill="none" stroke="currentColor" strokeWidth={2}>
                  <rect x="3" y="5" width="18" height="16" rx="3" />
                  <path d="M3 10h18M8 3v4M16 3v4" />
                </svg>
                <b>{EVENT.dateLabel}</b> · 3 kun
              </div>
              <div className="flex items-center gap-2.5 text-white/85">
                <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] text-brand-300" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
                  <circle cx="12" cy="9.5" r="2.5" />
                </svg>
                {EVENT.location}
              </div>
              <div className="flex items-center gap-2.5 text-white/85">
                <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] text-brand-300" fill="none" stroke="currentColor" strokeWidth={2}>
                  <circle cx="9" cy="8" r="3.5" />
                  <path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M21.5 20a6.5 6.5 0 0 0-4-6" />
                </svg>
                Cheklangan o&apos;rinlar: <b>{EVENT.seats} ta kompaniya</b>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Animatsion oltiburchak kompozitsiya */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.2 }}
          className="relative mx-auto hidden aspect-square w-full max-w-[520px] [perspective:1200px] sm:block"
        >
          <div className="absolute inset-0 grid place-items-center text-white/10">
            <Hex size={520} className="absolute h-full w-full animate-spin-slower" />
          </div>
          <div className="absolute inset-[9%] grid place-items-center text-white/15">
            <Hex size={420} className="absolute h-full w-full animate-spin-slow" />
          </div>
          <div className="absolute inset-[18%] grid place-items-center text-brand-300/30">
            <Hex size={340} className="absolute h-full w-full animate-spin-slower" stroke={1.5} />
          </div>

          {/* Orbitadagi nuqtalar */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-[4%]"
              animate={{ rotate: 360 }}
              transition={{ duration: 18 + i * 7, repeat: Infinity, ease: "linear", delay: i * -4 }}
            >
              <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-brand-300 shadow-[0_0_20px_6px_rgba(156,201,239,0.5)]" />
            </motion.div>
          ))}

          <motion.div style={{ rotateX: rx, rotateY: ry, x: tx, y: ty }} className="absolute inset-[27%] [transform-style:preserve-3d]">
            <div className="animate-float relative h-full w-full">
              <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full drop-shadow-[0_40px_60px_rgba(4,20,40,0.55)]">
                <defs>
                  <linearGradient id="hexfill" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#dbe9f6" />
                  </linearGradient>
                </defs>
                <path
                  d="M50 3 Q53 3 56 4.7 L88 23 Q93 26 93 32 V68 Q93 74 88 77 L56 95.3 Q50 98.5 44 95.3 L12 77 Q7 74 7 68 V32 Q7 26 12 23 L44 4.7 Q47 3 50 3Z"
                  fill="url(#hexfill)"
                />
              </svg>
              <div className="absolute inset-0 grid place-items-center [transform:translateZ(40px)]">
                <LogoMark className="h-[52%] w-[52%] text-brand-700" />
              </div>
            </div>
          </motion.div>

          {/* Suzuvchi teglar */}
          {[
            { t: "PAEI", c: "left-[2%] top-[22%]", d: 0 },
            { t: "OGSM", c: "right-[0%] top-[38%]", d: 1.2 },
            { t: "KPI", c: "left-[10%] bottom-[14%]", d: 2.1 },
          ].map((b) => (
            <motion.div
              key={b.t}
              className={`card-dark absolute ${b.c} px-4 py-2 text-sm font-extrabold tracking-wider text-white`}
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: b.d }}
            >
              <span className="mr-2 inline-block h-2 w-2 rounded-full bg-brand-300" />
              {b.t}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Pastga scroll ishorasi */}
      <motion.a
        href="#muammolar"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[11px] font-bold uppercase tracking-[0.3em] text-white/50 lg:flex"
      >
        <span className="relative h-10 w-6 rounded-full border border-white/30">
          <motion.span
            className="absolute left-1/2 top-2 h-2 w-1 -translate-x-1/2 rounded-full bg-white/70"
            animate={{ y: [0, 14, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
        </span>
      </motion.a>
    </section>
  );
}
