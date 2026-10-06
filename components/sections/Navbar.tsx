"use client";

import { motion, useMotionValueEvent, useScroll, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Logo from "../Logo";
import { useLead } from "../LeadModal";

const LINKS = [
  { href: "#dastur", label: "Dastur" },
  { href: "#spikerlar", label: "Spikerlar" },
  { href: "#jadval", label: "3 kun" },
  { href: "#narx", label: "Narx" },
];

export default function Navbar() {
  const { scrollY, scrollYProgress } = useScroll();
  const [solid, setSolid] = useState(false);
  const [menu, setMenu] = useState(false);
  const { open } = useLead();
  useMotionValueEvent(scrollY, "change", (v) => setSolid(v > 40));

  return (
    <>
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5"
      >
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between rounded-2xl px-4 py-3 transition-all duration-500 sm:px-6 ${
            solid ? "bg-brand-900/80 shadow-2xl shadow-brand-950/30 ring-1 ring-white/10 backdrop-blur-xl" : "bg-transparent"
          }`}
        >
          <a href="#" aria-label="FAZZA">
            <Logo light />
          </a>
          <nav className="hidden items-center gap-1 md:flex">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} className="rounded-full px-4 py-2 text-sm font-semibold text-white/75 transition hover:bg-white/10 hover:text-white">
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button
              onClick={() => open()}
              className="hidden rounded-full bg-white px-5 py-2.5 text-sm font-extrabold text-brand-800 transition hover:scale-[1.03] hover:bg-brand-100 sm:block"
            >
              Joy band qilish
            </button>
            <button onClick={() => setMenu((m) => !m)} aria-label="Menyu" className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white md:hidden">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
                {menu ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h10" />}
              </svg>
            </button>
          </div>
        </div>
        <AnimatePresence>
          {menu && (
            <motion.nav
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mx-auto mt-2 flex max-w-7xl flex-col rounded-2xl bg-brand-900/95 p-3 ring-1 ring-white/10 backdrop-blur-xl md:hidden"
            >
              {LINKS.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setMenu(false)} className="rounded-xl px-4 py-3 font-semibold text-white/85 hover:bg-white/10">
                  {l.label}
                </a>
              ))}
              <button
                onClick={() => {
                  setMenu(false);
                  open();
                }}
                className="mt-2 rounded-xl bg-white px-4 py-3 font-extrabold text-brand-800"
              >
                Joy band qilish
              </button>
            </motion.nav>
          )}
        </AnimatePresence>
      </motion.header>
      {/* Scroll progress */}
      <motion.div style={{ scaleX: scrollYProgress }} className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-brand-300 via-white to-brand-300" />
    </>
  );
}
