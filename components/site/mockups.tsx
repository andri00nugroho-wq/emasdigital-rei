import { ArrowDown, ArrowUp, Chart, Printer, Wallet } from "@/components/icons";
import { money } from "@/lib/format";

export function PhoneMockup({ price, buyback }: { price: number; buyback?: number }) {
  const sellPrice = buyback && buyback > 0 ? buyback : Math.round(price * 0.955);
  return (
    <div className="relative mx-auto w-[270px] sm:w-[300px]">
      <div className="absolute -inset-10 rounded-full bg-gold-500/10 blur-3xl" />
      <div className="relative rounded-[2.6rem] border border-white/15 bg-brand-950 p-2.5 shadow-[0_40px_80px_-40px_rgba(15,5,44,0.8)]">
        <div className="relative overflow-hidden rounded-[2.1rem] bg-cream-100">
          <div className="absolute left-1/2 top-2 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-brand-950" />
          <div className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 px-5 pb-8 pt-10 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-white/55">Selamat pagi,</p>
                <p className="text-[13px] font-semibold">Indriana</p>
              </div>
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gold-400/30 bg-gold-400/10 text-gold-300">
                <Wallet width={15} height={15} />
              </span>
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur">
              <p className="text-[9px] uppercase tracking-[0.18em] text-white/45">Saldo emas</p>
              <p className="mt-1 text-2xl font-bold tracking-tight">
                3,428 <span className="text-xs font-medium text-white/50">gram</span>
              </p>
              <p className="num mt-0.5 text-[11px] text-gold-300">{money(3428 * price)}</p>
              <div className="mt-3 grid grid-cols-4 gap-1.5">
                {[
                  { icon: ArrowUp, label: "Beli" },
                  { icon: ArrowDown, label: "Jual" },
                  { icon: Printer, label: "Cetak" },
                  { icon: Chart, label: "Riwayat" },
                ].map((b) => (
                  <div key={b.label} className="flex flex-col items-center gap-1 rounded-lg bg-white/[0.06] py-1.5">
                    <b.icon width={12} height={12} className="text-gold-300" />
                    <span className="text-[8px] text-white/65">{b.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2.5 px-4 py-4">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold text-brand-900">Harga emas hari ini</p>
              <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[8px] font-bold text-emerald-700">+0,8%</span>
            </div>
            <div className="rounded-xl border border-brand-900/8 bg-white p-3">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[8px] text-brand-900/45">Harga beli / gram</p>
                  <p className="num text-[13px] font-bold text-brand-900">{money(price)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[8px] text-brand-900/45">Buyback</p>
                  <p className="num text-[11px] font-semibold text-brand-900/70">{money(sellPrice)}</p>
                </div>
              </div>
              <svg viewBox="0 0 220 46" className="mt-2 h-10 w-full">
                <defs>
                  <linearGradient id="phoneSpark" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#d4af37" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0 40 L18 34 L36 36 L54 28 L72 31 L90 22 L108 25 L126 18 L144 22 L162 14 L180 17 L198 9 L220 12 L220 46 L0 46 Z" fill="url(#phoneSpark)" />
                <path d="M0 40 L18 34 L36 36 L54 28 L72 31 L90 22 L108 25 L126 18 L144 22 L162 14 L180 17 L198 9 L220 12" fill="none" stroke="#b78e1a" strokeWidth="1.6" />
              </svg>
            </div>

            <div className="rounded-xl border border-brand-900/8 bg-white p-3">
              <p className="text-[9px] font-semibold text-brand-900">Transaksi terakhir</p>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold-100 text-[8px] font-bold text-gold-800">Au</span>
                  <div>
                    <p className="text-[9px] font-semibold text-brand-900">Beli 0,5 gram</p>
                    <p className="text-[7px] text-brand-900/40">Hari ini · 09.42</p>
                  </div>
                </div>
                <p className="num text-[9px] font-semibold text-brand-900/70">{money(price * 0.5)}</p>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-brand-900 px-3 py-2 text-white">
              <span className="text-[8px] text-white/60">Wallet ID · terenkripsi</span>
              <span className="font-mono text-[8px] tracking-wider text-gold-300">REI-8821</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -right-3 top-16 rounded-2xl border border-brand-900/8 bg-white/95 px-3 py-2 shadow-soft backdrop-blur sm:-right-8">
        <p className="text-[8px] uppercase tracking-wider text-brand-900/40">Terverifikasi</p>
        <p className="text-[10px] font-bold text-brand-900">e-KTP + wajah</p>
      </div>
    </div>
  );
}
