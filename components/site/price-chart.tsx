"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Refresh } from "@/components/icons";
import { money, num } from "@/lib/format";

type Point = { price_date: string; buy_price: number; sell_price: number };

const RANGES = [
  { key: 30, label: "1B" },
  { key: 90, label: "3B" },
  { key: 180, label: "6B" },
  { key: 365, label: "1T" },
];

export function PriceChart({
  data,
  compact = false,
  defaultRange = 90,
}: {
  data: Point[];
  compact?: boolean;
  defaultRange?: number;
}) {
  const [range, setRange] = useState(defaultRange);
  const [metric, setMetric] = useState<"buy" | "sell">("buy");
  const [hover, setHover] = useState<number | null>(null);

  const sliced = useMemo(() => data.slice(-range), [data, range]);
  const values = sliced.map((d) => (metric === "buy" ? Number(d.buy_price) : Number(d.sell_price)));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const pad = (max - min) * 0.18 || max * 0.01;
  const lo = min - pad;
  const hi = max + pad;

  const W = 760;
  const H = compact ? 190 : 300;
  const P = { t: 16, r: 14, b: 28, l: 14 };
  const iw = W - P.l - P.r;
  const ih = H - P.t - P.b;

  const x = (i: number) => P.l + (sliced.length <= 1 ? iw / 2 : (i / (sliced.length - 1)) * iw);
  const y = (v: number) => P.t + ih - ((v - lo) / (hi - lo)) * ih;

  const line = sliced
    .map((_, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(2)},${y(values[i]).toFixed(2)}`)
    .join(" ");

  const area = `${line} L${x(sliced.length - 1).toFixed(2)},${(P.t + ih).toFixed(2)} L${x(0).toFixed(2)},${(P.t + ih).toFixed(2)} Z`;

  const first = values[0] || 0;
  const last = values[values.length - 1] || 0;
  const change = last - first;
  const changePct = first ? (change / first) * 100 : 0;

  const labelCount = compact ? 2 : 4;
  const labelIdxs = Array.from({ length: labelCount }, (_, i) => Math.round((i / (labelCount - 1)) * (sliced.length - 1)));
  const labels = [...new Set(labelIdxs)].map((i) => {
    const d = new Date(sliced[i]?.price_date || "");
    return {
      x: x(i),
      label: d.toLocaleDateString("id-ID", { day: "numeric", month: "short", ...(range > 200 ? { year: "2-digit" } : {}) }),
    };
  });

  const yTicks = [hi - pad, (hi + lo) / 2, lo + pad];

  const activeIdx = hover ?? sliced.length - 1;
  const active = sliced[activeIdx];

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-900/45">
            {metric === "buy" ? "Harga beli" : "Harga buyback"} / gram
          </p>
          <div className="mt-1 flex flex-wrap items-baseline gap-2.5">
            <span className="num text-3xl font-bold tracking-tight text-brand-900">{money(active ? (metric === "buy" ? active.buy_price : active.sell_price) : last)}</span>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                changePct >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
              }`}
            >
              {changePct >= 0 ? "▲" : "▼"} {Math.abs(changePct).toFixed(1)}%
            </span>
          </div>
          <p className="mt-1 text-[11px] text-brand-900/45">
            {active ? new Date(active.price_date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : ""}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-full border border-brand-900/10 bg-white p-0.5">
            {(["buy", "sell"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMetric(m)}
                className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition ${
                  metric === m ? "bg-brand-900 text-white" : "text-brand-900/55 hover:text-brand-900"
                }`}
              >
                {m === "buy" ? "Beli" : "Buyback"}
              </button>
            ))}
          </div>
          <div className="flex rounded-full border border-brand-900/10 bg-white p-0.5">
            {RANGES.map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => setRange(r.key)}
                className={`rounded-full px-2.5 py-1.5 text-[11px] font-semibold transition ${
                  range === r.key ? "bg-gold-500 text-brand-950" : "text-brand-900/55 hover:text-brand-900"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div
        className="relative mt-4 w-full select-none"
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const rel = ((e.clientX - rect.left) / rect.width) * W;
          const ratio = Math.min(1, Math.max(0, (rel - P.l) / iw));
          setHover(Math.round(ratio * (sliced.length - 1)));
        }}
      >
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Grafik harga emas">
          <defs>
            <linearGradient id="goldArea" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#d4af37" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
            </linearGradient>
          </defs>
          {yTicks.map((v, i) => (
            <g key={i}>
              <line x1={P.l} x2={W - P.r} y1={y(v)} y2={y(v)} stroke="#17083b" strokeOpacity="0.07" strokeDasharray="3 5" />
              {!compact && (
                <text x={W - P.r} y={y(v) - 5} textAnchor="end" fontSize="10" fill="#17083b" fillOpacity="0.38">
                  {money(v)}
                </text>
              )}
            </g>
          ))}
          <path d={area} fill="url(#goldArea)" />
          <path d={line} fill="none" stroke="#b78e1a" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
          {labels.map((l) => (
            <text key={l.x} x={l.x} y={H - 6} textAnchor="middle" fontSize="10" fill="#17083b" fillOpacity="0.4">
              {l.label}
            </text>
          ))}
          {active && (
            <>
              <line x1={x(activeIdx)} x2={x(activeIdx)} y1={P.t} y2={P.t + ih} stroke="#371f76" strokeOpacity="0.25" />
              <circle cx={x(activeIdx)} cy={y(values[activeIdx])} r="5.5" fill="#fff" stroke="#b78e1a" strokeWidth="2.5" />
            </>
          )}
        </svg>
        {active && (
          <div
            className="pointer-events-none absolute top-0 hidden -translate-x-1/2 rounded-lg bg-brand-950 px-2.5 py-1.5 text-[10px] font-medium text-white shadow-lg sm:block"
            style={{ left: `${(x(activeIdx) / W) * 100}%` }}
          >
            <span className="block text-gold-300">{new Date(active.price_date).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</span>
            <span className="num">{money(metric === "buy" ? active.buy_price : active.sell_price)}</span>
          </div>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between text-[10px] text-brand-900/35">
        <span className="inline-flex items-center gap-1">
          <Refresh width={11} height={11} /> Diperbarui harian
        </span>
        <span>Per 1 gram · {num(data.length)} data</span>
      </div>
    </div>
  );
}
