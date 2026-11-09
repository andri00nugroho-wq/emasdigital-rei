import Link from "next/link";
import { ArrowRight, Check, Coins, Gem, Heart, Shield, Smartphone, Sparkle, Users } from "@/components/icons";
import { PageHero } from "@/components/site/page-hero";
import { getLatestPrice, getProducts } from "@/lib/content";
import { money, num } from "@/lib/format";
import { getSettings } from "@/lib/settings";

export const metadata = {
  title: "Tentang Raja Emas Indonesia — Menuju Aplikasi Emas Digital No. 1",
  description: "Misi, nilai, dan cara kerja Raja Emas Indonesia dalam menghadirkan aplikasi emas digital yang mudah, aman, dan transparan.",
};

export default async function TentangPage() {
  const [s, latest, products] = await Promise.all([getSettings(), getLatestPrice(), getProducts({})]);
  const price = Number(latest?.buy_price || 0);
  const min = products.reduce((m, p) => Math.min(m, Number(p.price)), Infinity);

  return (
    <>
      <PageHero
        eyebrow="Tentang kami"
        title={<>Emas yang mudah diakses, <span className="font-display font-medium italic gold-text">untuk semua orang.</span></>}
        description={s.about_short}
        crumbs={[{ label: "Tentang" }]}
      />

      <section className="container-rei pt-12">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <p className="eyebrow">Cerita kami</p>
            <h2 className="mt-4 text-[30px] font-bold leading-tight tracking-[-0.03em] text-brand-900 sm:text-[36px]">
              Dibangun dari satu keyakinan: <span className="font-display font-medium italic text-brand-600">emas seharusnya mudah dimiliki.</span>
            </h2>
            <div className="prose-rei mt-5">
              <p>{s.about_long}</p>
              <p>
                Kami melihat banyak orang ingin mulai berinvestasi emas, tetapi terhalang oleh modal awal yang besar, proses yang rumit, dan informasi harga yang tidak transparan. Raja Emas Indonesia hadir untuk menghapus hambatan itu.
              </p>
              <p>
                Melalui emas digital, Anda dapat membeli mulai 0,1 gram, memantau saldo kapan saja, menjual dengan harga buyback harian, dan mencetak emas fisik ketika dibutuhkan — semuanya dalam satu pengalaman yang sederhana.
              </p>
              <p>
                Target kami jelas: menjadi aplikasi emas digital <strong>No. 1 di Indonesia</strong>. Bukan karena ingin menjadi yang terbesar, tetapi karena ingin menjadi yang paling dipercaya — dari gram pertama hingga cetak emas fisik.
              </p>
            </div>
            <div className="mt-7 flex flex-wrap gap-2">
              <Link href="/aplikasi" className="btn btn-md btn-primary"><Smartphone width={15} height={15} /> Unduh aplikasi</Link>
              <Link href="/produk" className="btn btn-md btn-outline">Lihat produk <ArrowRight width={15} height={15} /></Link>
            </div>
            <p className="mt-3 text-[11px] text-brand-900/45">Transaksi emas dilakukan melalui aplikasi resmi Raja Emas.</p>
          </div>

          <div className="grid grid-cols-2 gap-4 self-start">
            <div className="overflow-hidden rounded-2xl bg-brand-900 p-5 text-white">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/40">Harga emas hari ini</p>
              <p className="num mt-2 text-[24px] font-bold text-gold-300">{money(price)}</p>
              <p className="mt-1 text-[10px] text-white/40">per gram</p>
            </div>
            <div className="rounded-2xl border border-brand-900/8 bg-white p-5">
              <p className="text-[10px] uppercase tracking-[0.18em] text-brand-900/40">Mulai dari</p>
              <p className="num mt-2 text-[24px] font-bold text-brand-900">{money(min)}</p>
              <p className="mt-1 text-[10px] text-brand-900/40">0,1 gram</p>
            </div>
            <div className="rounded-2xl border border-brand-900/8 bg-white p-5">
              <p className="text-[10px] uppercase tracking-[0.18em] text-brand-900/40">Investor aktif</p>
              <p className="mt-2 text-[24px] font-bold text-brand-900">{s.stat_users}</p>
              <p className="mt-1 text-[10px] text-brand-900/40">{s.stat_customers_label}</p>
            </div>
            <div className="overflow-hidden rounded-2xl border border-gold-500/30 bg-gold-50 p-5">
              <p className="text-[10px] uppercase tracking-[0.18em] text-gold-800/60">Emas terkelola</p>
              <p className="mt-2 text-[24px] font-bold text-brand-900">{s.stat_volume}</p>
              <p className="mt-1 text-[10px] text-brand-900/40">{s.stat_volume_label}</p>
            </div>
            <div className="col-span-2 overflow-hidden rounded-2xl border border-brand-900/8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/hero-gold.png" alt="Emas batangan" className="h-56 w-full object-cover" />
            </div>
          </div>
        </div>

        <div className="mt-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow justify-center">Nilai kami</p>
            <h2 className="mt-3 text-[30px] font-bold tracking-tight text-brand-900">Tiga prinsip yang kami pegang</h2>
          </div>
          <div className="mt-9 grid gap-5 md:grid-cols-3">
            {[
              { icon: Shield, t: "Aman & tercatat", d: "Setiap transaksi dicatat rapi. Verifikasi akun dan pencatatan berlapis melindungi aset Anda." },
              { icon: Sparkle, t: "Transparan", d: "Harga beli, buyback, dan biaya ditampilkan jelas sebelum Anda bertransaksi." },
              { icon: Heart, t: "Berpihak pada pemula", d: "Bahasa sederhana, nominal kecil, dan panduan yang membantu — tanpa tekanan." },
            ].map((x) => (
              <div key={x.t} className="rounded-3xl border border-brand-900/8 bg-white p-6">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-900 text-gold-300"><x.icon width={19} height={19} /></span>
                <h3 className="mt-4 font-display text-xl text-brand-900">{x.t}</h3>
                <p className="mt-2 text-[12.5px] leading-relaxed text-brand-900/55">{x.d}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 grid gap-8 rounded-[2rem] bg-brand-900 p-7 text-white sm:p-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="eyebrow eyebrow-light">Cara kerja</p>
            <h2 className="mt-3 text-[28px] font-bold leading-tight tracking-tight sm:text-[34px]">
              Dari rupiah ke gram, <span className="font-display font-medium italic text-gold-300">dalam satu alur.</span>
            </h2>
            <p className="mt-3 max-w-lg text-[13px] leading-relaxed text-white/55">
              Anda menyetor dana, memilih nominal, dan menerima saldo emas. Ketika ingin emas fisik, saldo dapat dicetak. Ketika butuh dana, saldo dapat dijual dengan harga buyback.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-[12px] text-white/65">
              <span className="inline-flex items-center gap-1.5"><Users width={14} height={14} className="text-gold-400" /> Verifikasi identitas</span>
              <span className="inline-flex items-center gap-1.5"><Coins width={14} height={14} className="text-gold-400" /> Beli per gram</span>
              <span className="inline-flex items-center gap-1.5"><Gem width={14} height={14} className="text-gold-400" /> Cetak fisik</span>
            </div>
          </div>
          <div className="space-y-2.5">
            {[
              "Harga diperbarui setiap hari kerja",
              "Saldo tercatat atas nama Anda",
              "Buyback dengan spread yang dijelaskan",
              "Cetak emas fisik dengan pecahan pilihan",
            ].map((t) => (
              <div key={t} className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-[12px] text-white/70">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gold-500/15 text-gold-300"><Check width={11} height={11} /></span> {t}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-brand-900/8 bg-white/60 p-5 text-[11px] leading-relaxed text-brand-900/45">
          <strong className="text-brand-900/60">Catatan:</strong> {s.footer_note} Informasi pada situs ini bersifat umum dan tidak menggantikan nasihat keuangan profesional.
        </div>
      </section>
    </>
  );
}
