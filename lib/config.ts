// Tadbir va tariflar haqidagi barcha ma'lumotlar shu yerda — o'zgartirish oson bo'lishi uchun.

export const EVENT = {
  name: "FAZZA TOP CEO Praktikum",
  // Toshkent vaqti bilan boshlanish (countdown uchun)
  startISO: "2026-10-31T09:00:00+05:00",
  dateLabel: "31.10.2026",
  location: "Parkent, Krasnogorsk, LOTOS kompleksi",
  seats: 30,
  days: 3,
};

export type PlanId = "standart" | "standart_plus";

export const PLANS: Record<
  PlanId,
  { id: PlanId; title: string; price: number; short: string }
> = {
  standart: { id: "standart", title: "Standart", price: 14_900_000, short: "S" },
  standart_plus: { id: "standart_plus", title: "Standart+", price: 24_900_000, short: "P" },
};

export const CURRENCY = "UZS";

export function formatPrice(n: number) {
  return n.toLocaleString("ru-RU").replace(/,/g, " ").replace(/ /g, " ");
}

export function planFromShort(s: string): PlanId | null {
  if (s === "S") return "standart";
  if (s === "P") return "standart_plus";
  return null;
}
