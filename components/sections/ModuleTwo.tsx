"use client";

import { motion } from "framer-motion";
import { Eyebrow, Reveal, SplitHeading, Stagger, StaggerItem, onSpot } from "../ui";
import { Results, TopicList } from "./ModuleOne";

const TOPICS = [
  "Strategiya tushunchasi va ahamiyati",
  "Biznesning fundamental asoslari: Missiya, Vizyon, Qadriyatlar",
  "OGSM modeli asosida strategiya ishlab chiqish",
  "Strategik rejalashtirish va amalga oshirish",
  "Strategiyani jamoaga singdirish va motivatsiya",
];

const FUND = [
  { k: "Missiya", q: "Nega mavjudmiz?", d: "Kompaniyaning mijoz va jamiyat oldidagi asosiy vazifasi." },
  { k: "Vizyon", q: "Qayerga boramiz?", d: "Kompaniyaning kelajakdagi aniq va ilhomlantiruvchi qiyofasi." },
  { k: "Qadriyatlar", q: "Qanday yo‘l bilan?", d: "Qarorlar va jamoa xulq-atvorini belgilovchi tamoyillar." },
];

const OGSM = [
  { l: "O", en: "Objective", uz: "Maqsad", d: "Kompaniya erishmoqchi bo‘lgan asosiy, ilhomlantiruvchi maqsad.", dark: false },
  { l: "G", en: "Goals", uz: "O‘lchovli maqsadlar", d: "Muvaffaqiyatni raqamlarda qanday o‘lchaymiz.", dark: false },
  { l: "S", en: "Strategies", uz: "Strategiyalar", d: "Maqsadga qaysi yo‘llar orqali boramiz: tanlov va fokus.", dark: true },
  { l: "M", en: "Measures", uz: "Ko‘rsatkichlar (KPI)", d: "Har bir strategiya bajarilayotganini qanday nazorat qilamiz.", dark: true },
];

const RESULTS = [
  "Uzoq muddatli strategik fikrlash ko‘nikmasi",
  "Kompaniyangiz uchun aniq strategik yo‘l xaritasi",
  "Missiya, vizyon va qadriyatlar asosida qurilgan kompaniya fundamenti",
  "OGSM modeli asosidagi o‘lchovli strategik reja",
  "Strategiyani amalga oshirish mexanizmi: harakatlar rejasi + KPI tizimi",
  "Strategiyani motivatsiya tizimi bilan bog‘lash bo‘yicha amaliy yechimlar",
];

export default function ModuleTwo() {
  return (
    <>
      <section id="modul-2" className="grain relative overflow-hidden bg-brand-800 py-24 text-white sm:py-32">
        <div className="hex-grid absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />
        <div className="absolute -left-40 bottom-0 h-[500px] w-[500px] rounded-full bg-brand-500/30 blur-[120px]" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <Eyebrow light>Modul 2</Eyebrow>
          <SplitHeading text="Strategik boshqaruv" className="max-w-4xl text-4xl font-extrabold tracking-tight sm:text-6xl" />
          <TopicList items={TOPICS} />
        </div>
      </section>

      <section className="relative py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          {/* Fundament — piramida kabi pog'onali */}
          <Reveal>
            <h3 className="text-3xl font-extrabold tracking-tight text-brand-900 sm:text-5xl">Kompaniya fundamenti</h3>
          </Reveal>
          <Stagger className="mt-10 grid gap-4 md:grid-cols-3">
            {FUND.map((f, i) => (
              <StaggerItem key={f.k}>
                <div onMouseMove={onSpot} className="card spotlight group relative h-full overflow-hidden p-8 transition duration-500 hover:-translate-y-2">
                  <motion.div
                    className="absolute inset-x-0 bottom-0 h-1.5 origin-left bg-gradient-to-r from-brand-700 to-brand-300"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3 + i * 0.2 }}
                  />
                  <div className="eyebrow text-brand-600">{f.k}</div>
                  <div className="mt-4 text-3xl font-extrabold text-brand-900">{f.q}</div>
                  <p className="mt-3 text-[16px] leading-relaxed text-muted">{f.d}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal>
            <p className="mt-8 text-lg font-bold text-brand-800 sm:text-xl">
              Fundament mustahkam bo‘lsa, strategiya ham, jamoa ham bir yo‘nalishda harakat qiladi.
            </p>
          </Reveal>

          {/* OGSM */}
          <div className="mt-24">
            <Reveal>
              <h3 className="text-3xl font-extrabold tracking-tight text-brand-900 sm:text-5xl">OGSM: strategiya bir sahifada</h3>
            </Reveal>
            <div className="mt-10 hidden grid-cols-2 gap-4 lg:grid">
              {["Nimaga erishamiz", "Qanday erishamiz"].map((t, i) => (
                <Reveal key={t} delay={i * 0.1}>
                  <div className="eyebrow border-b-2 border-brand-700 pb-3 text-brand-800">{t}</div>
                </Reveal>
              ))}
            </div>
            <Stagger className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {OGSM.map((o) => (
                <StaggerItem key={o.l}>
                  <div
                    onMouseMove={onSpot}
                    className={`spotlight group relative h-full overflow-hidden rounded-[22px] p-7 transition duration-500 hover:-translate-y-2 ${
                      o.dark ? "bg-brand-700 text-white shadow-xl shadow-brand-700/25" : "card"
                    }`}
                  >
                    <div
                      className={`text-7xl font-extrabold leading-none transition duration-500 group-hover:scale-110 group-hover:-rotate-6 origin-left ${
                        o.dark ? "text-brand-300" : "text-brand-700"
                      }`}
                    >
                      {o.l}
                    </div>
                    <div className={`mt-6 text-xl font-extrabold ${o.dark ? "" : "text-brand-900"}`}>{o.en}</div>
                    <div className={`mt-1 text-sm font-bold ${o.dark ? "text-brand-300" : "text-brand-600"}`}>{o.uz}</div>
                    <p className={`mt-3 leading-relaxed ${o.dark ? "text-brand-100/85" : "text-muted"}`}>{o.d}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
            <Reveal>
              <p className="mt-8 text-lg font-bold text-brand-800 sm:text-xl">Natija: butun kompaniya uchun tushunarli, o‘lchanadigan strategik reja.</p>
            </Reveal>
          </div>

          <div className="mt-16">
            <Results label="Modul 2 natijalari" items={RESULTS} />
          </div>
        </div>
      </section>
    </>
  );
}
