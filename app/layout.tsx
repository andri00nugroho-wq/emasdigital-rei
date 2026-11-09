import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = process.env.SITE_URL || "http://web-emdig.test";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Raja Emas Indonesia — Emas Digital Premium",
    template: "%s | Raja Emas Indonesia",
  },
  description:
    "Beli emas digital murni mulai 0,1 gram dengan harga transparan, buyback harian, dan saldo yang bisa dicetak menjadi emas fisik. Mulai investasi emas yang tenang bersama Raja Emas Indonesia.",
  keywords: ["emas digital", "investasi emas", "beli emas online", "raja emas indonesia", "tabungan emas"],
  icons: {
    icon: [{ url: "/logo-rei-2.png", type: "image/png" }],
    shortcut: "/logo-rei-2.png",
    apple: "/logo-rei-2.png",
  },
  openGraph: {
    title: "Raja Emas Indonesia — Emas Digital Premium",
    description: "Miliki emas murni mulai 0,1 gram. Harga transparan, buyback harian, bisa dicetak fisik.",
    type: "website",
    locale: "id_ID",
    images: ["/images/hero-gold.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#371f76",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className="h-full" suppressHydrationWarning>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
