"use client";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export function track(event: string, data?: Record<string, unknown>, eventID?: string) {
  if (typeof window === "undefined" || !window.fbq) return;
  if (eventID) window.fbq("track", event, data || {}, { eventID });
  else window.fbq("track", event, data || {});
}

function getCookie(name: string) {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/[.$?*|{}()[\]\\/+^]/g, "\\$&") + "=([^;]*)"));
  return m ? decodeURIComponent(m[1]) : "";
}

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid"];

/** Saytga birinchi kirganda UTM va fbclid ni eslab qolamiz */
export function captureAttribution() {
  try {
    const p = new URLSearchParams(window.location.search);
    const saved = JSON.parse(sessionStorage.getItem("attr") || "{}");
    let changed = false;
    for (const k of UTM_KEYS) {
      const v = p.get(k);
      if (v) {
        saved[k] = v;
        changed = true;
      }
    }
    if (p.get("fbclid")) saved.fbclid_ts = Date.now();
    if (changed) sessionStorage.setItem("attr", JSON.stringify(saved));
  } catch {
    /* sessionStorage yopiq bo'lishi mumkin */
  }
}

export function getAttribution() {
  let saved: Record<string, string | number> = {};
  try {
    saved = JSON.parse(sessionStorage.getItem("attr") || "{}");
  } catch {}
  const p = new URLSearchParams(window.location.search);
  const fbclid = p.get("fbclid") || (saved.fbclid as string) || "";

  let fbc = getCookie("_fbc");
  if (!fbc && fbclid) fbc = `fb.1.${saved.fbclid_ts || Date.now()}.${fbclid}`;

  const utm: Record<string, string> = {};
  for (const k of UTM_KEYS.slice(0, 5)) {
    const v = p.get(k) || (saved[k] as string);
    if (v) utm[k] = v;
  }
  return { fbp: getCookie("_fbp"), fbc, utm };
}

export function newLeadId() {
  const a = new Uint8Array(6);
  crypto.getRandomValues(a);
  return Array.from(a, (b) => b.toString(16).padStart(2, "0")).join("");
}
