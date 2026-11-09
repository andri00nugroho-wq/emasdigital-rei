import { DownloadIcon, External, SettingsIcon, Smartphone, Users } from "@/components/icons";
import { Card, Flash, PageHead } from "@/components/cms/ui";
import { saveSettings } from "@/lib/actions/admin";
import { getSession } from "@/lib/auth";
import { getSettings } from "@/lib/settings";

export const metadata = { title: "Pengaturan Situs — CMS" };

export default async function CmsSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string; error?: string }>;
}) {
  const [sp, settings, session] = await Promise.all([searchParams, getSettings(), getSession()]);
  const v = (key: string, fallback = "") => settings[key] ?? fallback;

  return (
    <>
      <PageHead
        title="Pengaturan Situs"
        description="Identitas, kontak, media sosial, dan angka statistik yang tampil di seluruh halaman."
        actions={<a href="/" target="_blank" className="btn btn-md btn-outline">Lihat situs <External width={13} height={13} /></a>}
      />
      <Flash saved={sp.saved} deleted={sp.deleted} error={sp.error} />

      <form action={saveSettings} className="grid gap-4 xl:grid-cols-2">
        <Card className="p-5">
          <p className="text-[12px] font-bold text-brand-900">Identitas situs</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="site_name">Nama lengkap</label>
              <input id="site_name" name="site_name" defaultValue={v("site_name", "Raja Emas Indonesia")} className="field" />
            </div>
            <div>
              <label className="label" htmlFor="site_short">Nama singkat</label>
              <input id="site_short" name="site_short" defaultValue={v("site_short", "Raja Emas")} className="field" />
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="tagline">Tagline</label>
              <input id="tagline" name="tagline" defaultValue={v("tagline")} className="field" placeholder="Investasi emas digital yang aman dan mudah" />
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="about_short">Tentang singkat</label>
              <textarea id="about_short" name="about_short" rows={3} defaultValue={v("about_short")} className="field-area" />
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="about_long">Tentang lengkap (HTML)</label>
              <textarea id="about_long" name="about_long" rows={7} defaultValue={v("about_long")} className="field-area font-mono text-[11.5px]" />
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="footer_note">Catatan footer</label>
              <textarea id="footer_note" name="footer_note" rows={2} defaultValue={v("footer_note")} className="field-area" />
            </div>
          </div>
        </Card>

        <Card className="p-5 xl:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="flex items-center gap-1.5 text-[12px] font-bold text-brand-900">
                <Smartphone width={14} height={14} /> Aplikasi &amp; toko aplikasi
              </p>
              <p className="mt-1 text-[10.5px] text-brand-900/40">
                Nama aplikasi dan tautan toko tampil sebagai tombol unduh di header, beranda, dan halaman aplikasi.
              </p>
            </div>
            <a href="/aplikasi" target="_blank" className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-700 transition hover:text-brand-900">
              Lihat halaman aplikasi <External width={12} height={12} />
            </a>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="label" htmlFor="app_name">Nama aplikasi</label>
              <input id="app_name" name="app_name" defaultValue={v("app_name", "Raja Emas")} className="field" placeholder="Raja Emas" />
            </div>
            <div>
              <label className="label" htmlFor="app_badge">Badge</label>
              <input id="app_badge" name="app_badge" defaultValue={v("app_badge", "Aplikasi resmi")} className="field" placeholder="Aplikasi resmi" />
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="app_tagline">Tagline aplikasi</label>
              <input id="app_tagline" name="app_tagline" defaultValue={v("app_tagline", "Emas digital dalam genggam Anda")} className="field" />
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="play_store_url">URL Google Play</label>
              <input id="play_store_url" name="play_store_url" defaultValue={v("play_store_url")} className="field font-mono text-[11px]" placeholder="https://play.google.com/store/apps/details?id=…" />
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="app_store_url">URL App Store</label>
              <input id="app_store_url" name="app_store_url" defaultValue={v("app_store_url")} className="field font-mono text-[11px]" placeholder="https://apps.apple.com/id/app/…" />
            </div>
            <div>
              <label className="label" htmlFor="app_rating">Rating toko</label>
              <input id="app_rating" name="app_rating" defaultValue={v("app_rating", "4,9/5")} className="field" placeholder="4,9/5" />
            </div>
            <div>
              <label className="label" htmlFor="app_reviews">Jumlah ulasan</label>
              <input id="app_reviews" name="app_reviews" defaultValue={v("app_reviews", "1.200+ ulasan")} className="field" placeholder="1.200+ ulasan" />
            </div>
            <div className="sm:col-span-2 lg:col-span-4">
              <p className="rounded-xl border border-gold-500/20 bg-gold-50 px-3.5 py-2.5 text-[10.5px] leading-relaxed text-brand-900/55">
                Tempel tautan lengkap halaman aplikasi di masing-masing toko. Jika dikosongkan, situs memakai tautan resmi Raja Emas sebagai cadangan.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <p className="text-[12px] font-bold text-brand-900">Kontak & media sosial</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="phone">Telepon</label>
              <input id="phone" name="phone" defaultValue={v("phone")} className="field" placeholder="+62 21 …" />
            </div>
            <div>
              <label className="label" htmlFor="whatsapp">WhatsApp (angka)</label>
              <input id="whatsapp" name="whatsapp" defaultValue={v("whatsapp")} className="field" placeholder="6281234567890" />
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="email">Email</label>
              <input id="email" name="email" type="email" defaultValue={v("email")} className="field" placeholder="halo@rajaemasindonesia.co.id" />
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="address">Alamat</label>
              <textarea id="address" name="address" rows={2} defaultValue={v("address")} className="field-area" />
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="operational_hours">Jam operasional</label>
              <input id="operational_hours" name="operational_hours" defaultValue={v("operational_hours")} className="field" placeholder="Senin–Jumat, 08.00–17.00 WIB" />
            </div>
            <div>
              <label className="label" htmlFor="instagram">Instagram</label>
              <input id="instagram" name="instagram" defaultValue={v("instagram")} className="field" placeholder="https://instagram.com/…" />
            </div>
            <div>
              <label className="label" htmlFor="tiktok">TikTok</label>
              <input id="tiktok" name="tiktok" defaultValue={v("tiktok")} className="field" placeholder="https://tiktok.com/@…" />
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="youtube">YouTube</label>
              <input id="youtube" name="youtube" defaultValue={v("youtube")} className="field" placeholder="https://youtube.com/@…" />
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <p className="text-[12px] font-bold text-brand-900">Statistik & kepercayaan</p>
          <p className="mt-1 text-[10.5px] text-brand-900/40">Angka yang tampil di hero dan bagian statistik beranda.</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="stat_users">Jumlah pengguna</label>
              <input id="stat_users" name="stat_users" defaultValue={v("stat_users")} className="field" placeholder="28.400+" />
            </div>
            <div>
              <label className="label" htmlFor="stat_customers_label">Label pengguna</label>
              <input id="stat_customers_label" name="stat_customers_label" defaultValue={v("stat_customers_label")} className="field" placeholder="Investor aktif" />
            </div>
            <div>
              <label className="label" htmlFor="stat_volume">Volume emas</label>
              <input id="stat_volume" name="stat_volume" defaultValue={v("stat_volume")} className="field" placeholder="4,2 ton" />
            </div>
            <div>
              <label className="label" htmlFor="stat_volume_label">Label volume</label>
              <input id="stat_volume_label" name="stat_volume_label" defaultValue={v("stat_volume_label")} className="field" placeholder="Emas terjual" />
            </div>
            <div>
              <label className="label" htmlFor="stat_years">Lama berdiri</label>
              <input id="stat_years" name="stat_years" defaultValue={v("stat_years")} className="field" placeholder="9 tahun" />
            </div>
            <div>
              <label className="label" htmlFor="stat_years_label">Label pengalaman</label>
              <input id="stat_years_label" name="stat_years_label" defaultValue={v("stat_years_label")} className="field" placeholder="Melayani investor" />
            </div>
            <div>
              <label className="label" htmlFor="stat_rating">Rating</label>
              <input id="stat_rating" name="stat_rating" defaultValue={v("stat_rating")} className="field" placeholder="4,9/5" />
            </div>
            <div>
              <label className="label" htmlFor="stat_rating_label">Label rating</label>
              <input id="stat_rating_label" name="stat_rating_label" defaultValue={v("stat_rating_label")} className="field" placeholder="Ulasan pelanggan" />
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <p className="text-[12px] font-bold text-brand-900">Funnel &amp; arsip</p>
          <p className="mt-1 text-[10.5px] leading-relaxed text-brand-900/40">
            Situs kini berfokus pada unduhan aplikasi. Modul lead magnet lama tidak lagi tampil di halaman publik.
          </p>

          <div className="mt-4 space-y-2.5">
            <a href="/cms/download" className="flex items-start gap-2.5 rounded-xl border border-brand-900/8 bg-cream-50 p-3 transition hover:border-gold-500/40 hover:bg-gold-50/50">
              <DownloadIcon width={14} height={14} className="mt-0.5 text-brand-600" />
              <span>
                <span className="block text-[11px] font-semibold text-brand-900">Arsip panduan</span>
                <span className="block text-[10px] text-brand-900/45">File lama tetap tersimpan dan bisa diunduh ulang bila diperlukan.</span>
              </span>
            </a>
            <a href="/cms/leads" className="flex items-start gap-2.5 rounded-xl border border-brand-900/8 bg-cream-50 p-3 transition hover:border-gold-500/40 hover:bg-gold-50/50">
              <Users width={14} height={14} className="mt-0.5 text-brand-600" />
              <span>
                <span className="block text-[11px] font-semibold text-brand-900">Leads lama</span>
                <span className="block text-[10px] text-brand-900/45">Data pengunduh lama tersimpan untuk follow-up, tanpa form baru di situs.</span>
              </span>
            </a>
          </div>

          <div className="mt-5 rounded-xl border border-brand-900/8 bg-brand-50/60 p-3.5">
            <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-brand-900/40"><SettingsIcon width={12} height={12} /> Akun pengelola</p>
            <p className="mt-1.5 text-[11.5px] font-semibold text-brand-900">{session?.name}</p>
            <p className="text-[10.5px] text-brand-900/50">{session?.email} · {session?.role === "superadmin" ? "Super Admin" : "Editor"}</p>
            <p className="mt-2 text-[10px] leading-relaxed text-brand-900/40">Untuk mengubah email atau kata sandi, perbarui data pada tabel <code className="font-mono">admin_users</code> di database.</p>
          </div>

          <div className="mt-4 flex justify-end">
            <button type="submit" className="btn btn-md btn-primary">Simpan pengaturan</button>
          </div>
        </Card>
      </form>
    </>
  );
}
