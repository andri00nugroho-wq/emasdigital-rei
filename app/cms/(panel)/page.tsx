import Link from "next/link";
import {
  ArrowRight,
  Book,
  CheckCircle,
  DownloadIcon,
  FileText,
  ImageIcon,
  Inbox,
  Message,
  Package,
  Plus,
  SettingsIcon,
  Smartphone,
  Tag,
} from "@/components/icons";
import { Card, PageHead, StatCard } from "@/components/cms/ui";
import { getLatestPrice, getPreviousPrice } from "@/lib/content";
import { query, queryOne } from "@/lib/db";
import { shortDate, timeAgo, money } from "@/lib/format";
import { getSettings } from "@/lib/settings";

export const metadata = { title: "Dashboard CMS" };

export default async function CmsDashboard() {
  const [
    productsActive,
    productsTotal,
    articlesTotal,
    articlesPublished,
    unread,
    messagesTotal,
    price,
    prevPrice,
    recentMessages,
    recentArticles,
    downloadsTotal,
    faqsTotal,
    bannersTotal,
    s,
  ] = await Promise.all([
    queryOne<{ c: number }>("SELECT COUNT(*) c FROM products WHERE is_active = 1"),
    queryOne<{ c: number }>("SELECT COUNT(*) c FROM products"),
    queryOne<{ c: number }>("SELECT COUNT(*) c FROM articles"),
    queryOne<{ c: number }>("SELECT COUNT(*) c FROM articles WHERE status = 'published'"),
    queryOne<{ c: number }>("SELECT COUNT(*) c FROM contact_messages WHERE is_read = 0"),
    queryOne<{ c: number }>("SELECT COUNT(*) c FROM contact_messages"),
    getLatestPrice(),
    getPreviousPrice(),
    query<{ id: number; name: string; subject: string | null; message: string; is_read: number; created_at: string }>(
      "SELECT id, name, subject, message, is_read, created_at FROM contact_messages ORDER BY created_at DESC LIMIT 4"
    ),
    query<{ id: number; title: string; status: string; category: string; published_at: string | null }>(
      "SELECT id, title, status, category, published_at FROM articles ORDER BY id DESC LIMIT 4"
    ),
    queryOne<{ c: number }>("SELECT COUNT(*) c FROM downloads"),
    queryOne<{ c: number }>("SELECT COUNT(*) c FROM faqs WHERE is_active = 1"),
    queryOne<{ c: number }>("SELECT COUNT(*) c FROM banners WHERE is_active = 1"),
    getSettings(),
  ]);

  const priceDelta = Number(price?.buy_price || 0) - Number(prevPrice?.buy_price || 0);
  const appReady = Boolean(s.play_store_url && s.app_store_url);
  const appName = s.app_name || "Raja Emas";

  return (
    <>
      <PageHead
        title="Dashboard"
        description="Ringkasan konten situs, harga emas, dan kesiapan aplikasi Raja Emas."
        actions={
          <>
            <Link href="/cms/harga" className="btn btn-md btn-outline"><Tag width={15} height={15} /> Perbarui harga</Link>
            <Link href="/cms/pengaturan" className="btn btn-md btn-primary"><Smartphone width={15} height={15} /> Kelola aplikasi</Link>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Produk aktif" value={Number(productsActive?.c || 0)} hint={`dari ${productsTotal?.c ?? 0} produk terdaftar`} icon={Package} tone="dark" />
        <StatCard label="Artikel terbit" value={Number(articlesPublished?.c || 0)} hint={`dari ${articlesTotal?.c ?? 0} artikel`} icon={FileText} />
        <StatCard label="Harga emas / gram" value={money(price?.buy_price)} hint={`Buyback ${money(price?.sell_price)}`} icon={Tag} tone="gold" />
        <StatCard label="Pesan belum dibaca" value={Number(unread?.c || 0)} hint={`${messagesTotal?.c ?? 0} total pesan masuk`} icon={Inbox} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <Card className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[13px] font-bold text-brand-900">Kesiapan aplikasi</p>
              <p className="mt-0.5 max-w-md text-[10.5px] leading-relaxed text-brand-900/40">
                Seluruh jalur konversi situs berakhir di halaman <strong className="text-brand-900/60">/aplikasi</strong> dan toko aplikasi. Tidak ada transaksi atau CTA WhatsApp di web.
              </p>
            </div>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${appReady ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
              <CheckCircle width={12} height={12} /> {appReady ? "Siap" : "Lengkapi URL"}
            </span>
          </div>

          <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {[
              { label: "Google Play", value: s.play_store_url },
              { label: "App Store", value: s.app_store_url },
            ].map((store) => (
              <div key={store.label} className="rounded-xl border border-brand-900/8 bg-cream-50 px-3.5 py-3">
                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-brand-900/40">{store.label}</p>
                <p className={`mt-1 truncate text-[11px] font-semibold ${store.value ? "text-brand-900/75" : "text-rose-600"}`}>
                  {store.value || "Belum diatur"}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-1.5 text-[10.5px] text-brand-900/45">
            <span>Aplikasi: <strong className="text-brand-900/70">{appName}</strong></span>
            <span>Rating: <strong className="text-brand-900/70">{s.app_rating || "—"}</strong></span>
            <span>{s.app_reviews || "—"}</span>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Link href="/cms/pengaturan" className="btn btn-md btn-primary"><SettingsIcon width={13} height={13} /> Pengaturan aplikasi</Link>
            <Link href="/aplikasi" target="_blank" className="btn btn-md btn-outline">Buka halaman aplikasi <ArrowRight width={12} height={12} /></Link>
          </div>
        </Card>

        <Card className="flex flex-col p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[13px] font-bold text-brand-900">Harga emas terakhir</p>
              <p className="mt-0.5 text-[10.5px] text-brand-900/40">{shortDate(price?.price_date)}</p>
            </div>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gold-100 text-gold-700"><Tag width={15} height={15} /></span>
          </div>
          <p className="num mt-5 text-[30px] font-bold tracking-tight text-brand-900">{money(price?.buy_price)}</p>
          <p className="mt-1 text-[10.5px] text-brand-900/40">Buyback {money(price?.sell_price)} · per gram</p>
          <p className={`mt-2 inline-flex items-center gap-1 text-[10.5px] font-semibold ${priceDelta >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
            {priceDelta >= 0 ? "+" : ""}{money(priceDelta)} dari hari sebelumnya
          </p>

          <div className="mt-auto space-y-2 pt-5">
            <Link href="/cms/harga" className="btn btn-md btn-primary w-full"><Tag width={15} height={15} /> Input harga hari ini</Link>
            <Link href="/harga" target="_blank" className="btn btn-md btn-outline w-full">Lihat halaman harga</Link>
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between border-b border-brand-900/8 px-5 py-3.5">
            <div>
              <p className="text-[13px] font-bold text-brand-900">Pesan masuk</p>
              <p className="text-[10px] text-brand-900/40">{unread?.c ?? 0} pesan belum dibaca</p>
            </div>
            <Link href="/cms/pesan" className="text-[10.5px] font-semibold text-brand-700">Semua →</Link>
          </div>
          <div className="divide-y divide-brand-900/[0.05]">
            {recentMessages.map((m) => (
              <Link key={m.id} href="/cms/pesan" className="flex gap-3 px-5 py-3.5 transition hover:bg-brand-50/40">
                <span className={`mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${m.is_read ? "bg-brand-50 text-brand-500" : "bg-gold-100 text-gold-700"}`}>
                  <Message width={14} height={14} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-[11.5px] font-semibold text-brand-900">{m.name}</p>
                    <span className="shrink-0 text-[9px] text-brand-900/35">{timeAgo(m.created_at)}</span>
                  </div>
                  <p className="truncate text-[10px] text-brand-900/45">{m.subject || "Tanpa subjek"}</p>
                  <p className="mt-0.5 line-clamp-1 text-[10px] text-brand-900/55">{m.message}</p>
                </div>
              </Link>
            ))}
            {recentMessages.length === 0 && <p className="px-5 py-10 text-center text-[11px] text-brand-900/40">Belum ada pesan.</p>}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between border-b border-brand-900/8 px-5 py-3.5">
            <div>
              <p className="text-[13px] font-bold text-brand-900">Artikel terbaru</p>
              <p className="text-[10px] text-brand-900/40">Konten edukasi untuk mendukung funnel aplikasi</p>
            </div>
            <Link href="/cms/artikel" className="text-[10.5px] font-semibold text-brand-700">Semua →</Link>
          </div>
          <div className="divide-y divide-brand-900/[0.05]">
            {recentArticles.map((a) => (
              <Link key={a.id} href={`/cms/artikel/${a.id}`} className="flex items-center gap-3 px-5 py-3.5 transition hover:bg-brand-50/40">
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600"><FileText width={14} height={14} /></span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11.5px] font-semibold text-brand-900">{a.title}</p>
                  <p className="mt-0.5 text-[9.5px] text-brand-900/40">{a.category} · {shortDate(a.published_at)}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold ${a.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                  {a.status === "published" ? "Terbit" : "Draf"}
                </span>
              </Link>
            ))}
            {recentArticles.length === 0 && <p className="px-5 py-10 text-center text-[11px] text-brand-900/40">Belum ada artikel.</p>}
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_1fr]">
        <Card className="p-5">
          <p className="text-[13px] font-bold text-brand-900">Akses cepat</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {[
              { href: "/cms/produk", label: "Kelola produk", icon: Package },
              { href: "/cms/artikel/baru", label: "Tulis artikel", icon: FileText },
              { href: "/cms/banner", label: "Kelola banner hero", icon: ImageIcon },
              { href: "/cms/pengaturan", label: "Pengaturan aplikasi", icon: SettingsIcon },
            ].map((x) => (
              <Link key={x.href} href={x.href} className="group flex flex-col gap-2 rounded-xl border border-brand-900/8 p-3 transition hover:border-gold-500/40 hover:bg-gold-50/40">
                <x.icon width={16} height={16} className="text-brand-600 group-hover:text-gold-700" />
                <span className="flex items-center justify-between text-[10.5px] font-semibold text-brand-900/70">
                  {x.label} <ArrowRight width={11} height={11} />
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-4 rounded-xl bg-brand-900 p-4 text-white">
            <p className="text-[10px] uppercase tracking-widest text-white/40">Status situs</p>
            <p className="mt-1 flex items-center gap-1.5 text-[12px] font-semibold"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Publik &amp; CMS berjalan normal</p>
            <p className="mt-1 text-[9.5px] text-white/35">Fokus funnel: unduhan aplikasi via Play Store &amp; App Store</p>
          </div>
        </Card>

        <Card className="p-5">
          <p className="text-[13px] font-bold text-brand-900">Ringkasan konten</p>
          <div className="mt-4 space-y-2.5">
            {[
              { label: "Produk", value: productsTotal?.c ?? 0, href: "/cms/produk", icon: Package },
              { label: "Artikel", value: articlesTotal?.c ?? 0, href: "/cms/artikel", icon: FileText },
              { label: "Banner hero aktif", value: bannersTotal?.c ?? 0, href: "/cms/banner", icon: ImageIcon },
              { label: "FAQ aktif", value: faqsTotal?.c ?? 0, href: "/cms/faq", icon: Book },
            ].map((x) => (
              <Link key={x.label} href={x.href} className="flex items-center gap-2.5 rounded-lg px-1 py-1 text-[11px] text-brand-900/60 transition hover:text-brand-900">
                <x.icon width={13} height={13} className="text-brand-500" />
                <span className="flex-1">{x.label}</span>
                <span className="font-semibold text-brand-900">{x.value}</span>
                <ArrowRight width={10} height={10} className="text-brand-900/25" />
              </Link>
            ))}
          </div>
          <div className="mt-4 rounded-xl border border-dashed border-brand-900/12 bg-cream-50 p-3.5">
            <p className="flex items-center gap-1.5 text-[10.5px] font-bold text-brand-900/65"><DownloadIcon width={12} height={12} /> Arsip panduan lama</p>
            <p className="mt-1 text-[9.5px] leading-relaxed text-brand-900/40">
              {downloadsTotal?.c ?? 0} file dan data leads lama tersimpan, tetapi tidak lagi ditampilkan di situs publik.
            </p>
            <div className="mt-2 flex gap-3 text-[9.5px] font-semibold text-brand-700">
              <Link href="/cms/download">File</Link>
              <Link href="/cms/leads">Leads</Link>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
