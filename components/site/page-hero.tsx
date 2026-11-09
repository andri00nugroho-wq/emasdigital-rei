import Link from "next/link";
import { ChevronRight } from "@/components/icons";

export function PageHero({
  eyebrow,
  title,
  description,
  crumbs = [],
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  crumbs?: { label: string; href?: string }[];
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-brand-950 text-white noise">
      <div className="absolute inset-0 grid-lines opacity-60" />
      <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-gold-500/12 blur-3xl" />
      <div className="container-rei relative pb-14 pt-10 sm:pb-16 sm:pt-12">
        <nav className="flex flex-wrap items-center gap-1.5 text-[11px] text-white/40">
          <Link href="/" className="transition hover:text-white">Beranda</Link>
          {crumbs.map((c) => (
            <span key={c.label} className="inline-flex items-center gap-1.5">
              <ChevronRight width={11} height={11} className="text-white/25" />
              {c.href ? <Link href={c.href} className="transition hover:text-white">{c.label}</Link> : <span className="text-gold-300">{c.label}</span>}
            </span>
          ))}
        </nav>

        <p className="eyebrow eyebrow-light mt-7">{eyebrow}</p>
        <h1 className="mt-4 max-w-3xl text-[34px] font-bold leading-[1.08] tracking-[-0.03em] sm:text-[46px]">{title}</h1>
        {description && <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-white/55">{description}</p>}
        {children && <div className="mt-7">{children}</div>}
      </div>
    </section>
  );
}
