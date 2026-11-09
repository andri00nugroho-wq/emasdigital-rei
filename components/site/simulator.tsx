"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Refresh, Smartphone } from "@/components/icons";
import { money, num } from "@/lib/format";

const QUICK = [500_000, 1_000_000, 5_000_000, 10_000_000];

export function Simulator({
  pricePerGram,
  buybackPerGram,
}: {
  pricePerGram: number;
  buybackPerGram: number;
}) {
  const [mode, setMode] = useState<"beli" | "jual">("beli");
  const [rupiah, setRupiah] = useState("1000000");
  const [gram, setGram] = useState("1");

  const value = Number(rupiah.replace(/\D/g, "")) || 0;
  const gramValue = Number(gram.replace(",", ".")) || 0;

  const grams = useMemo(() => (pricePerGram ? value / pricePerGram : 0), [value, pricePerGram]);
  const rupiahOut = useMemo(() => Math.round(gramValue * buybackPerGram), [gramValue, buybackPerGram]);

  return (
    <div className="overflow-hidden rounded-[1.8rem] border border-brand-900/[0.07] bg-white shadow-lift">
      <div className="flex items-center justify-between border-b border-brand-900/8 px-5 py-4">
        <div className="flex rounded-full bg-brand-50 p-1">
          {(["beli", "jual"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`rounded-full px-4 py-1.5 text-[12px] font-bold capitalize transition ${
                mode === m ? "bg-brand-800 text-white shadow-sm" : "text-brand-900/55"
              }`}
            >
              {m === "beli" ? "Beli emas" : "Jual emas"}
            </button>
          ))}
        </div>
        <span className="hidden items-center gap-1 text-[10px] font-medium text-brand-900/40 sm:inline-flex">
          <Refresh width={11} height={11} /> Harga hari ini
        </span>
      </div>

      <div className="p-5 sm:p-6">
        {mode === "beli" ? (
          <>
            <label className="label" htmlFor="sim-rupiah">Nominal pembelian</label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-brand-900/45">Rp</span>
              <input
                id="sim-rupiah"
                inputMode="numeric"
                value={value ? value.toLocaleString("id-ID") : ""}
                onChange={(e) => setRupiah(e.target.value.replace(/\D/g, "").slice(0, 12))}
                className="field h-14 pl-11 pr-4 text-lg font-bold tracking-tight"
                placeholder="1.000.000"
              />
            </div>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {QUICK.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setRupiah(String(q))}
                  className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold transition ${
                    value === q ? "border-gold-500 bg-gold-50 text-gold-800" : "border-brand-900/10 text-brand-900/55 hover:border-brand-700/30"
                  }`}
                >
                  {money(q).replace("Rp ", "Rp ")}
                </button>
              ))}
            </div>

            <div className="mt-5 rounded-2xl bg-gradient-to-br from-brand-900 to-brand-800 p-4 text-white">
              <p className="text-[11px] uppercase tracking-[0.16em] text-white/50">Perkiraan emas yang didapat</p>
              <div className="mt-1.5 flex items-baseline gap-2">
                <span className="num text-3xl font-bold text-gold-300">{num(grams, 3)}</span>
                <span className="text-sm font-medium text-white/60">gram</span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3 text-[11px] text-white/55">
                <span>Harga / gram</span>
                <span className="num font-semibold text-white/85">{money(pricePerGram)}</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <label className="label" htmlFor="sim-gram">Jumlah emas yang dijual</label>
            <div className="relative">
              <input
                id="sim-gram"
                inputMode="decimal"
                value={gram}
                onChange={(e) => setGram(e.target.value.replace(/[^0-9.,]/g, "").slice(0, 9))}
                className="field h-14 pr-16 text-lg font-bold tracking-tight"
                placeholder="1"
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-brand-900/45">gram</span>
            </div>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {[0.1, 0.5, 1, 5].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setGram(String(q))}
                  className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold transition ${
                    Number(gram) === q ? "border-gold-500 bg-gold-50 text-gold-800" : "border-brand-900/10 text-brand-900/55 hover:border-brand-700/30"
                  }`}
                >
                  {num(q, 2)} g
                </button>
              ))}
            </div>

            <div className="mt-5 rounded-2xl bg-gradient-to-br from-brand-900 to-brand-800 p-4 text-white">
              <p className="text-[11px] uppercase tracking-[0.16em] text-white/50">Perkiraan dana diterima</p>
              <div className="mt-1.5 text-3xl font-bold text-gold-300 num">{money(rupiahOut)}</div>
              <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3 text-[11px] text-white/55">
                <span>Harga buyback / gram</span>
                <span className="num font-semibold text-white/85">{money(buybackPerGram)}</span>
              </div>
            </div>
          </>
        )}

        <Link href="/aplikasi" className="btn btn-md btn-gold mt-4 w-full">
          {mode === "beli" ? "Lanjut di aplikasi" : "Mulai di aplikasi"} <Smartphone width={16} height={16} />
        </Link>
        <p className="mt-2.5 text-center text-[10px] text-brand-900/38">
          Simulasi estimasi. Harga final dikonfirmasi saat transaksi di aplikasi.
        </p>
      </div>
    </div>
  );
}
