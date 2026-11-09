import Link from "next/link";
import { ArrowUpRight, Smartphone } from "@/components/icons";
import { ArticleCard } from "@/components/site/cards";
import { PageHero } from "@/components/site/page-hero";
import { getArticles } from "@/lib/content";
import { getSettings } from "@/lib/settings";

export const metadata = {
  title: "Artikel & Insight Emas",
  description: "Panduan, strategi, dan insight seputar investasi emas digital dari tim Raja Emas Indonesia.",
};

export default async function ArtikelPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string }>;
}) {
  const sp = await searchParams;
  const [all, s] = await Promise.all([getArticles({ limit: 100 }), getSettings()]);
  const categories = Array.from(new Set(all.map((a) => a.category)));
  const active = sp.kategori && categories.includes(sp.kategori) ? sp.kategori : "semua";
  const articles = active === "semua" ? all : all.filter((a) => a.category === active);
  const featured = all[0];

  return (
    <>
      <PageHero
        eyebrow="Artikel & insight"
        title={<>Belajar emas, <span className="font-display font-medium italic gold-text">tanpa jargon.</span></>}
        description="Panduan praktis untuk investor pemula sampai yang sudah rutin menabung emas. Kami tulis singkat, jelas, dan bisa langsung dipraktikkan."
        crumbs={[{ label: "Artikel" }]}
      />

      <section className="container-rei pt-10">
        {featured && active === "semua" && (
          <Link href={`/artikel/${featured.slug}`} className="group grid overflow-hidden rounded-[2rem] border border-brand-900/8 bg-white shadow-soft lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative aspect-[16/10] overflow-hidden bg-brand-100 lg:aspect-auto lg:min-h-[340px]">
              {featured.cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={featured.cover} alt={featured.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
              ) : (
                <div className="h-full bg-gradient-to-br from-brand-800 to-brand-950" />
              )}
              <span className="absolute left-4 top-4 rounded-full bg-brand-950/85 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gold-200 backdrop-blur">Sorotan</span>
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-9">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">{featured.category}</p>
              <h2 className="mt-3 font-display text-[26px] leading-snug text-brand-900 sm:text-[32px]">{featured.title}</h2>
              <p className="mt-3 text-[13px] leading-relaxed text-brand-900/55">{featured.excerpt}</p>
              <div className="mt-6 flex items-center justify-between gap-4">
                <span className="text-[11px] text-brand-900/40">
                  {featured.published_at ? new Date(featured.published_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : ""} · {featured.author}
                </span>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-brand-900/10 text-brand-700 transition group-hover:border-gold-500 group-hover:bg-gold-500 group-hover:text-brand-950">
                  <ArrowUpRight width={16} height={16} />
                </span>
              </div>
            </div>
          </Link>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-1.5 rounded-2xl border border-brand-900/8 bg-white p-2 shadow-soft">
          <Link
            href="/artikel"
            className={`rounded-xl px-4 py-2 text-[12px] font-semibold transition ${active === "semua" ? "bg-brand-900 text-white" : "text-brand-900/55 hover:bg-brand-50"}`}
          >
            Semua
          </Link>
          {categories.map((c) => (
            <Link
              key={c}
              href={`/artikel?kategori=${encodeURIComponent(c)}`}
              className={`rounded-xl px-4 py-2 text-[12px] font-semibold transition ${active === c ? "bg-brand-900 text-white" : "text-brand-900/55 hover:bg-brand-50"}`}
            >
              {c}
            </Link>
          ))}
        </div>

        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => <ArticleCard key={a.id} article={a} />)}
        </div>

        <div className="mt-14 grid items-center gap-5 rounded-3xl bg-brand-900 p-7 text-white sm:grid-cols-[auto_1fr_auto] sm:p-9">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-500 text-brand-950">
            <Smartphone width={22} height={22} />
          </span>
          <div>
            <p className="text-[17px] font-semibold">Siap mempraktikkan ilmunya?</p>
            <p className="mt-1 text-[12px] text-white/55">Mulai dari 0,1 gram lewat aplikasi. Beli, jual, dan cetak emas fisik langsung dari ponsel.</p>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Link href="/aplikasi" className="btn btn-md btn-gold"><Smartphone width={16} height={16} /> Unduh aplikasi</Link>
          </div>
        </div>
      </section>
    </>
  );
}
