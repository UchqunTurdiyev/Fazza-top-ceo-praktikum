"use client";

import { AnimatePresence, motion } from "framer-motion";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { PlanId } from "@/lib/config";
import { captureAttribution } from "@/lib/pixel";
import LeadForm from "./LeadForm";
import { LogoMark } from "./Logo";

type Ctx = { open: (plan?: PlanId) => void };
const LeadCtx = createContext<Ctx>({ open: () => {} });
export const useLead = () => useContext(LeadCtx);

export function LeadProvider({ children }: { children: ReactNode }) {
  const [plan, setPlan] = useState<PlanId | null>(null);
  const open = useCallback((p: PlanId = "standart") => setPlan(p), []);
  const close = () => setPlan(null);

  useEffect(() => captureAttribution(), []);

  useEffect(() => {
    if (!plan) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [plan]);

  return (
    <LeadCtx.Provider value={{ open }}>
      {children}
      <AnimatePresence>
        {plan && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-brand-950/70 backdrop-blur-md" onClick={close} />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Ro'yxatdan o'tish"
              initial={{ y: 60, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-[28px] bg-white p-6 shadow-2xl sm:rounded-[28px] sm:p-8"
            >
              <button
                onClick={close}
                aria-label="Yopish"
                className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-brand-50 text-brand-700 transition hover:rotate-90 hover:bg-brand-100"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
              <div className="mb-6 flex items-center gap-3 pr-10">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-700 text-white">
                  <LogoMark className="h-7 w-7" />
                </span>
                <div>
                  <h3 className="text-xl font-extrabold leading-tight text-brand-900">Joyingizni band qiling</h3>
                  <p className="text-sm text-muted">31.10.2026 · faqat 30 ta kompaniya</p>
                </div>
              </div>
              <LeadForm defaultPlan={plan} onDone={close} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </LeadCtx.Provider>
  );
}
