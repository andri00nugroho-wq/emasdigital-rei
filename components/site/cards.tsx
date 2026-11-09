import Link from "next/link";
import { ArrowUpRight } from "@/components/icons";
import { money, num } from "@/lib/format";
import type { Product } from "@/lib/types";
import { CATEGORY_LABEL } from "@/lib/content";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/produk/${product.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-[1.7rem] border border-brand-900/[0.07] bg-white p-2.5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.3rem] bg-brand-50">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.045]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-brand-800 to-brand-950 text-gold-300">
            <span className="font-display text-3xl">REI</span>
          </div>
        )}
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          {product.badge ? (
            <span className="rounded-full bg-brand-950/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gold-200 backdrop-blur">
              {product.badge}
            </span>
          ) : (
            <span />
          )}
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-brand-700 backdrop-blur">
            {CATEGORY_LABEL[product.category] || product.category}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-3 pb-3 pt-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[15px] font-bold leading-snug text-brand-900">{product.name}</h3>
          <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-brand-900/10 text-brand-700 transition group-hover:border-gold-500 group-hover:bg-gold-500 group-hover:text-brand-950">
            <ArrowUpRight width={14} height={14} />
          </span>
        </div>
        <p className="mt-1.5 line-clamp-2 text-[12.5px] leading-relaxed text-brand-900/55">{product.short_desc}</p>

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div>
            <p className="num text-[17px] font-bold tracking-tight text-brand-900">{money(product.price)}</p>
            <p className="mt-0.5 text-[11px] text-brand-900/45">
              {num(product.weight_gram, 3)} gram · buyback {money(product.buyback_price)}
            </p>
          </div>
          <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[10px] font-semibold text-brand-700">
            {money(Number(product.price) / Number(product.weight_gram)).replace("Rp ", "Rp ")}/g
          </span>
        </div>
      </div>
    </Link>
  );
}

export function ArticleCard({ article }: { article: { slug: string; title: string; excerpt: string | null; cover: string | null; category: string; published_at: string | null } }) {
  return (
    <Link
      href={`/artikel/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-brand-900/[0.07] bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-brand-100">
        {article.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.cover}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-brand-800 to-brand-950">
            <span className="font-display text-3xl text-gold-300">REI</span>
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-700">
          {article.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[11px] font-medium text-brand-900/40">
          {article.published_at
            ? new Date(article.published_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
            : ""}
        </p>
        <h3 className="mt-2 font-display text-[19px] leading-snug text-brand-900 transition group-hover:text-brand-700">
          {article.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-[12.5px] leading-relaxed text-brand-900/55">{article.excerpt}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold text-brand-700">
          Baca artikel <ArrowUpRight width={13} height={13} />
        </span>
      </div>
    </Link>
  );
}
