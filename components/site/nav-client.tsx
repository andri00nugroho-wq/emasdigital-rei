"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Close, Menu, Smartphone } from "@/components/icons";
import { StoreBadges } from "@/components/site/store-badges";
import { money } from "@/lib/format";

const links = [
  { href: "/produk", label: "Produk" },
  { href: "/aplikasi", label: "Aplikasi" },
  { href: "/harga", label: "Harga Emas" },
  { href: "/artikel", label: "Artikel" },
  { href: "/tentang", label: "Tentang" },
  { href: "/kontak", label: "Kontak" },
];

export function SiteNav({
  price,
  delta,
}: {
  price: number;
  delta: number;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div className="relative z-50 bg-brand-950 text-white/70">
        <div className="container-rei flex h-9 items-center justify-between gap-4 text-[11px]">
          <div className="flex min-w-0 items-center gap-2">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-400 opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold-400" />
            </span>
            <span className="truncate">
              Harga emas hari ini <strong className="font-semibold text-white">{money(price)}</strong>/gram
            </span>
            <span
              className={`hidden items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold sm:inline-flex ${
                delta >= 0 ? "bg-emerald-400/10 text-emerald-300" : "bg-rose-400/10 text-rose-300"
              }`}
            >
              {delta >= 0 ? "+" : ""}
              {money(delta)}
            </span>
          </div>
          <div className="hidden items-center gap-5 sm:flex">
            <span className="inline-flex items-center gap-1.5 text-white/45">
              <Smartphone width={12} height={12} /> Aplikasi resmi Raja Emas Indonesia
            </span>
            <Link href="/aplikasi" className="inline-flex items-center gap-1.5 text-gold-300 transition hover:text-gold-200">
              Unduh di Play Store &amp; App Store
            </Link>
          </div>
        </div>
      </div>

      <header
        className={`sticky top-0 z-40 border-b border-white/10 bg-brand-900/95 backdrop-blur-xl transition-shadow ${
          scrolled ? "shadow-[0_18px_40px_-24px_rgba(15,5,44,0.9)]" : ""
        }`}
      >
        <div className="container-rei flex h-[70px] items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2" aria-label="Raja Emas Indonesia">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-rei.png" alt="Raja Emas Indonesia" className="h-9 w-auto sm:h-10" />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {links.map((l) => {
              const active = pathname === l.href || pathname.startsWith(l.href + "/");
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`rounded-full px-4 py-2 text-[13.5px] font-medium transition ${
                    active ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2.5 lg:flex">
            <Link href="/aplikasi" className="btn btn-md btn-gold">
              <Smartphone width={16} height={16} /> Unduh aplikasi
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white lg:hidden"
            aria-label="Buka menu"
          >
            <Menu />
          </button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-[70] bg-brand-950 text-white lg:hidden">
          <div className="container-rei flex h-[70px] items-center justify-between">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-rei.png" alt="Raja Emas Indonesia" className="h-9 w-auto" />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15"
              aria-label="Tutup menu"
            >
              <Close />
            </button>
          </div>
          <div className="container-rei flex h-[calc(100dvh-70px)] flex-col justify-between overflow-y-auto pb-8">
            <nav className="mt-6 divide-y divide-white/10">
              {links.map((l, i) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between py-5 text-xl font-semibold tracking-tight"
                >
                  <span className={pathname.startsWith(l.href) ? "text-gold-300" : ""}>{l.label}</span>
                  <span className="num text-xs text-white/30">0{i + 1}</span>
                </Link>
              ))}
            </nav>
            <div className="space-y-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-[11px] uppercase tracking-widest text-white/45">Harga emas hari ini</p>
                <p className="num mt-1 text-2xl font-bold text-gold-300">{money(price)}<span className="text-sm font-medium text-white/50">/gram</span></p>
              </div>
              <Link href="/aplikasi" onClick={() => setOpen(false)} className="btn btn-lg btn-gold w-full">
                <Smartphone width={18} height={18} /> Unduh aplikasi
              </Link>
              <StoreBadges className="justify-center" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
