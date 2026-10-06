import type { Metadata, Viewport } from "next";
import "@fontsource-variable/manrope";
import Script from "next/script";
import "./globals.css";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://fazza.uz";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "FAZZA TOP CEO Praktikum — 3 kunlik amaliy dastur | 31.10.2026",
  description:
    "Kompaniyada o'zgarishlarni samarali boshqarish va strategik boshqaruv. Biznes egalari, CEO va top-menejerlar uchun 3 kunlik amaliy praktikum. Cheklangan o'rinlar: 30 ta kompaniya.",
  openGraph: {
    title: "FAZZA TOP CEO Praktikum",
    description: "Kompaniya o'z rahbaridan tezroq o'sa olmaydi. 3 kunlik amaliy praktikum — 31.10.2026.",
    images: ["/images/gallery/gallery-2.jpg"],
    locale: "uz_UZ",
    type: "website",
  },
  icons: { icon: "/logo-mark.svg" },
};

export const viewport: Viewport = {
  themeColor: "#1a4d7a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body className="font-sans">
        {children}

        {PIXEL_ID && (
          <>
            <Script id="meta-pixel" strategy="afterInteractive">
              {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${PIXEL_ID}');fbq('track','PageView');`}
            </Script>
            <noscript>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                alt=""
                src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
              />
            </noscript>
          </>
        )}
      </body>
    </html>
  );
}
