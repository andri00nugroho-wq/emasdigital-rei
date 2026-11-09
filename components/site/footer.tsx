import Link from "next/link";
import { ArrowUpRight, Instagram, Mail, MapPin, Phone, Smartphone } from "@/components/icons";
import { getSettings } from "@/lib/settings";
import { Logo } from "./logo";
import { StoreBadges } from "./store-badges";

export async function SiteFooter() {
  const s = await getSettings();

  return (
    <footer className="relative mt-24 overflow-hidden bg-brand-950 text-white">
      <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-gold-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-48 -left-32 h-96 w-96 rounded-full bg-brand-500/20 blur-3xl" />
      <div className="container-rei relative pb-24 pt-16 lg:pb-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Logo height={40} />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/55">
              {s.tagline ||
                "Emas digital premium untuk masa depan yang lebih tenang. Mulai dari 0,1 gram, kapan saja."}
            </p>
            <StoreBadges playUrl={s.play_store_url} appStoreUrl={s.app_store_url} className="mt-5" />
            <div className="mt-5 flex items-center gap-2">
              {s.instagram && (
                <a
                  href={s.instagram}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/12 text-white/70 transition hover:border-gold-400/50 hover:text-gold-300"
                >
                  <Instagram width={16} height={16} />
                </a>
              )}
              {s.tiktok && (
                <a
                  href={s.tiktok}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="TikTok"
                  className="inline-flex h-9 items-center justify-center rounded-full border border-white/12 px-3 text-[11px] font-semibold text-white/70 transition hover:border-gold-400/50 hover:text-gold-300"
                >
                  TikTok
                </a>
              )}
              {s.youtube && (
                <a
                  href={s.youtube}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                  className="inline-flex h-9 items-center justify-center rounded-full border border-white/12 px-3 text-[11px] font-semibold text-white/70 transition hover:border-gold-400/50 hover:text-gold-300"
                >
                  YouTube
                </a>
              )}
            </div>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-400">Produk</p>
            <ul className="mt-5 space-y-3 text-sm text-white/60">
              <li><Link href="/aplikasi" className="transition hover:text-white">Aplikasi Raja Emas</Link></li>
              <li><Link href="/produk?kategori=digital" className="transition hover:text-white">Emas Digital</Link></li>
              <li><Link href="/produk?kategori=fisik" className="transition hover:text-white">Emas Fisik</Link></li>
              <li><Link href="/produk?kategori=gift" className="transition hover:text-white">Emas Gift</Link></li>
              <li><Link href="/harga" className="transition hover:text-white">Harga &amp; Buyback</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-400">Perusahaan</p>
            <ul className="mt-5 space-y-3 text-sm text-white/60">
              <li><Link href="/tentang" className="transition hover:text-white">Tentang Kami</Link></li>
              <li><Link href="/artikel" className="transition hover:text-white">Artikel &amp; Insight</Link></li>
              <li><Link href="/kontak" className="transition hover:text-white">Hubungi Kami</Link></li>
              <li><Link href="/kebijakan-privasi" className="transition hover:text-white">Kebijakan Privasi</Link></li>
              <li><Link href="/syarat-ketentuan" className="transition hover:text-white">Syarat &amp; Ketentuan</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-400">Kontak</p>
            <ul className="mt-5 space-y-4 text-sm text-white/60">
              <li className="flex gap-3">
                <MapPin width={16} height={16} className="mt-0.5 shrink-0 text-gold-500" />
                <span>{s.address}</span>
              </li>
              <li>
                <a href={`tel:${(s.phone || "").replace(/\s/g, "")}`} className="flex gap-3 transition hover:text-white">
                  <Phone width={16} height={16} className="mt-0.5 shrink-0 text-gold-500" />
                  {s.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${s.email}`} className="flex gap-3 transition hover:text-white">
                  <Mail width={16} height={16} className="mt-0.5 shrink-0 text-gold-500" />
                  {s.email}
                </a>
              </li>
              <li>
                <Link
                  href="/aplikasi"
                  className="inline-flex items-center gap-2 rounded-full bg-gold-500/10 px-4 py-2 font-semibold text-gold-300 transition hover:bg-gold-500/20"
                >
                  <Smartphone width={16} height={16} /> Aplikasi Raja Emas
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 rounded-2xl border border-white/10 bg-white/[0.035] p-5 text-[12px] leading-relaxed text-white/45">
          <strong className="text-white/65">Catatan risiko:</strong> {s.footer_note}
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-7 text-[12px] text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {s.site_name}. Seluruh hak cipta dilindungi.</p>
          <div className="flex items-center gap-5">
            <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Layanan aktif</span>
            <Link href="/cms/login" className="inline-flex items-center gap-1 transition hover:text-white/70">
              Admin CMS <ArrowUpRight width={12} height={12} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
