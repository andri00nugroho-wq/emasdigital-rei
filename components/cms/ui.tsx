import Link from "next/link";
import { ArrowRight, CheckCircle } from "@/components/icons";

export function PageHead({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-[22px] font-bold tracking-tight text-brand-900 sm:text-[26px]">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-[12px] leading-relaxed text-brand-900/50">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Flash({ saved, deleted, error }: { saved?: string; deleted?: string; error?: string }) {
  if (!saved && !deleted && !error) return null;
  return (
    <div
      className={`mb-5 flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-[12px] font-medium ${
        error ? "border-rose-200 bg-rose-50 text-rose-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"
      }`}
    >
      {!error && <CheckCircle width={15} height={15} />}
      {error ? error : deleted ? "Data berhasil dihapus." : "Perubahan berhasil disimpan."}
    </div>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-brand-900/8 bg-white shadow-[0_1px_2px_rgba(15,5,44,0.04)] ${className}`}>{children}</div>;
}

export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = "light",
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  icon: React.ComponentType<{ width?: number; height?: number; className?: string }>;
  tone?: "light" | "dark" | "gold";
}) {
  const tones = {
    light: "bg-white border-brand-900/8",
    dark: "bg-brand-900 border-brand-900 text-white",
    gold: "bg-gold-50 border-gold-500/25",
  };
  const Icon = icon;
  return (
    <div className={`rounded-2xl border p-4 sm:p-5 ${tones[tone]}`}>
      <div className="flex items-start justify-between">
        <p className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${tone === "dark" ? "text-white/45" : "text-brand-900/40"}`}>{label}</p>
        <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${tone === "dark" ? "bg-white/10 text-gold-300" : tone === "gold" ? "bg-gold-500/15 text-gold-700" : "bg-brand-50 text-brand-700"}`}>
          <Icon width={15} height={15} />
        </span>
      </div>
      <p className={`mt-3 text-[26px] font-bold leading-none tracking-tight ${tone === "dark" ? "text-white" : "text-brand-900"}`}>{value}</p>
      {hint && <p className={`mt-2 text-[10.5px] ${tone === "dark" ? "text-white/40" : "text-brand-900/40"}`}>{hint}</p>}
    </div>
  );
}

export function StatusBadge({ active, labels = ["Aktif", "Nonaktif"] }: { active: boolean; labels?: [string, string] }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
        active ? "bg-emerald-50 text-emerald-700" : "bg-neutral-100 text-neutral-500"
      }`}
    >
      <span className={`h-1 w-1 rounded-full ${active ? "bg-emerald-500" : "bg-neutral-400"}`} />
      {active ? labels[0] : labels[1]}
    </span>
  );
}

export function TableWrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className="w-full min-w-[720px] text-left text-[12px]">{children}</table>
    </div>
  );
}

export function Th({ children, className = "", colSpan }: { children?: React.ReactNode; className?: string; colSpan?: number }) {
  return <th colSpan={colSpan} className={`px-4 py-3 text-[9.5px] font-bold uppercase tracking-[0.12em] text-brand-900/35 ${className}`}>{children}</th>;
}

export function Td({ children, className = "", colSpan }: { children?: React.ReactNode; className?: string; colSpan?: number }) {
  return <td colSpan={colSpan} className={`px-4 py-3 align-middle ${className}`}>{children}</td>;
}

export function FormActions({ cancelHref, label = "Simpan perubahan" }: { cancelHref: string; label?: string }) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-t border-brand-900/8 pt-5">
      <button type="submit" className="btn btn-md btn-primary">{label}</button>
      <Link href={cancelHref} className="btn btn-md btn-outline">Batal</Link>
    </div>
  );
}

export function AdminLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-700 hover:text-brand-900">
      {children} <ArrowRight width={12} height={12} />
    </Link>
  );
}

export function Empty({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="px-6 py-14 text-center">
      <p className="text-[14px] font-semibold text-brand-900">{title}</p>
      {desc && <p className="mx-auto mt-1 max-w-sm text-[11.5px] text-brand-900/45">{desc}</p>}
    </div>
  );
}
