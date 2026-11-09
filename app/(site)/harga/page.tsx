import Link from "next/link";
import { ArrowDown, ArrowUp, ArrowUpRight, Check, Refresh, Smartphone, TrendingDown, TrendingUp } from "@/components/icons";
import { PageHero } from "@/components/site/page-hero";
import { PriceChart } from "@/components/site/price-chart";
import { getLatestPrice, getPreviousPrice, getPriceSeries } from "@/lib/content";
import { formatDate, money, num, shortDate } from "@/lib/format";

export const metadata = {
  title: "Harga Emas Hari Ini & Buyback",
  description: "Harga emas digital Raja Emas Indonesia hari ini, grafik 12 bulan, dan riwayat harga buyback per gram.",
};

export default async function HargaPage() {
  const [latest, prev, series] = await Promise.all([
    getLatestPrice(),
    getPreviousPrice(),
    getPriceSeries(365),
  ]);

  const price = Number(latest?.buy_price || 0);
  const buyback = Number(latest?.sell_price || 0);
  const delta = price - Number(prev?.buy_price || price);
  const deltaPct = prev?.buy_price ? (delta / Number(prev.buy_price)) * 100 : 0;
  const spread = price - buyback;
  const spreadPct = price ? (spread / price) * 100 : 0;
  const yearStart = series[0]?.buy_price || price;
  const yearPct = yearStart ? ((price - yearStart) / yearStart) * 100 : 0;

  const table = [...series].slice(-30).reverse();

  return (
    <>
      <PageHero
        eyebrow="Harga emas"
        title={<>Harga emas hari ini, <span className="font-display font-medium italic gold-text">transparan.</span></>}
        description={`Diperbarui ${formatDate(latest?.price_date)}. Harga beli dan buyback ditampilkan terpisah agar Anda bisa menghitung dengan jelas.`}
        crumbs={[{ label: "Harga Emas" }]}
      >
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 text-[11px] font-semibold text-emerald-300">
            <Refresh width={12} height={12} /> Diperbarui hari ini
          </span>
          <span className="text-[11px] text-white/40">Sumber: harga internal Raja Emas Indonesia</span>
        </div>
      </PageHero>

      <section className="container-rei -mt-8 relative z-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-brand-900/8 bg-white p-5 shadow-soft">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-900/40">Harga beli / gram</p>
            <p className="num mt-2 text-[28px] font-bold tracking-tight text-brand-900">{money(price)}</p>
            <p className={`mt-2 inline-flex items-center gap-1 text-[11px] font-semibold ${delta >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
              {delta >= 0 ? <TrendingUp width={12} height={12} /> : <TrendingDown width={12} height={12} />}
              {delta >= 0 ? "+" : ""}{money(delta)} ({deltaPct.toFixed(2)}%) dari hari sebelumnya
            </p>
          </div>
          <div className="rounded-2xl border border-brand-900/8 bg-white p-5 shadow-soft">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-900/40">Harga buyback / gram</p>
            <p className="num mt-2 text-[28px] font-bold tracking-tight text-brand-900">{money(buyback)}</p>
            <p className="mt-2 text-[11px] text-brand-900/45">Harga saat Anda menjual kembali</p>
          </div>
          <div className="rounded-2xl border border-brand-900/8 bg-white p-5 shadow-soft">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-900/40">Spread hari ini</p>
            <p className="num mt-2 text-[28px] font-bold tracking-tight text-brand-900">{money(spread)}</p>
            <p className="mt-2 text-[11px] text-brand-900/45">Setara {spreadPct.toFixed(2)}% dari harga beli</p>
          </div>
          <div className="rounded-2xl border border-gold-500/25 bg-gold-50 p-5 shadow-soft">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-800/60">Perubahan 12 bulan</p>
            <p className="num mt-2 text-[28px] font-bold tracking-tight text-brand-900">{yearPct >= 0 ? "+" : ""}{yearPct.toFixed(1)}%</p>
            <p className="mt-2 text-[11px] text-brand-900/45">Dibandingkan awal periode data</p>
          </div>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="card p-5 sm:p-7">
            <PriceChart data={series} defaultRange={180} />
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl bg-brand-900 p-5 text-white">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">Cara membaca</p>
              <h3 className="mt-2 font-display text-xl text-gold-200">Beli vs buyback</h3>
              <p className="mt-2 text-[11.5px] leading-relaxed text-white/55">
                Harga beli adalah harga yang Anda bayar. Buyback adalah harga saat Anda menjual kembali. Selisih keduanya disebut spread dan merupakan biaya transaksi.
              </p>
              <Link href="/artikel/membaca-harga-emas-harian-dan-buyback" className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-semibold text-gold-300 hover:text-gold-200">
                Baca panduan lengkap <ArrowUpRight width={12} height={12} />
              </Link>
            </div>
            <div className="rounded-2xl border border-brand-900/8 bg-white p-5">
              <p className="text-[12px] font-bold text-brand-900">Ingin mulai di harga hari ini?</p>
              <p className="mt-1 text-[11px] leading-relaxed text-brand-900/50">Halaman ini bersifat informasi. Transaksi beli dan jual dilakukan melalui aplikasi; harga dikunci saat konfirmasi.</p>
              <Link href="/aplikasi" className="btn btn-md btn-gold mt-4 w-full">
                <Smartphone width={15} height={15} /> Mulai di aplikasi
              </Link>
              <Link href="/produk" className="btn btn-md btn-outline mt-2 w-full">
                Lihat produk
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-brand-900/8 bg-white shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-900/8 px-5 py-4">
            <div>
              <h2 className="text-[15px] font-bold text-brand-900">Riwayat 30 hari terakhir</h2>
              <p className="mt-0.5 text-[11px] text-brand-900/40">Harga per gram dalam Rupiah</p>
            </div>
            <span className="rounded-full bg-brand-50 px-3 py-1 text-[10px] font-semibold text-brand-700">Hari kerja</span>
          </div>
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full min-w-[560px] text-left text-[12px]">
              <thead>
                <tr className="border-b border-brand-900/8 text-[10px] uppercase tracking-wider text-brand-900/40">
                  <th className="px-5 py-3 font-semibold">Tanggal</th>
                  <th className="px-5 py-3 font-semibold">Harga beli</th>
                  <th className="px-5 py-3 font-semibold">Buyback</th>
                  <th className="px-5 py-3 font-semibold">Perubahan</th>
                  <th className="px-5 py-3 text-right font-semibold">Arah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-900/[0.06]">
                {table.map((row, i) => {
                  const next = table[i + 1];
                  const diff = next ? Number(row.buy_price) - Number(next.buy_price) : 0;
                  return (
                    <tr key={row.id} className="transition hover:bg-brand-50/50">
                      <td className="px-5 py-3.5 font-medium text-brand-900">{shortDate(row.price_date)}</td>
                      <td className="num px-5 py-3.5 font-semibold text-brand-900">{money(row.buy_price)}</td>
                      <td className="num px-5 py-3.5 text-brand-900/65">{money(row.sell_price)}</td>
                      <td className={`num px-5 py-3.5 font-medium ${diff > 0 ? "text-emerald-600" : diff < 0 ? "text-rose-600" : "text-brand-900/40"}`}>
                        {diff === 0 ? "—" : `${diff > 0 ? "+" : ""}${money(diff)}`}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {diff > 0 ? <ArrowUp width={14} height={14} className="ml-auto text-emerald-600" /> : diff < 0 ? <ArrowDown width={14} height={14} className="ml-auto text-rose-600" /> : <span className="text-brand-900/25">—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 grid gap-4 rounded-2xl border border-brand-900/8 bg-white/60 p-5 text-[11px] leading-relaxed text-brand-900/45 sm:grid-cols-3">
          <p className="flex gap-2"><Check width={14} height={14} className="mt-0.5 shrink-0 text-gold-600" /> Harga diperbarui pada hari kerja dan dapat berubah sewaktu-waktu.</p>
          <p className="flex gap-2"><Check width={14} height={14} className="mt-0.5 shrink-0 text-gold-600" /> Spread sehat umumnya berada di kisaran 2–5% dari harga beli.</p>
          <p className="flex gap-2"><Check width={14} height={14} className="mt-0.5 shrink-0 text-gold-600" /> Harga pada halaman ini bersifat indikatif, bukan penawaran yang mengikat.</p>
        </div>

        <p className="mt-6 text-[10px] text-brand-900/35">
          Total {num(series.length)} data harga tersedia · pembaruan terakhir {formatDate(latest?.price_date)}.
        </p>
      </section>
    </>
  );
}
