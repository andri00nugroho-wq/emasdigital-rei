import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check, Clock, Smartphone } from "@/components/icons";
import { ArticleCard } from "@/components/site/cards";
import { PageHero } from "@/components/site/page-hero";
import { getArticleBySlug, getArticles } from "@/lib/content";
import { execute } from "@/lib/db";
import { formatDate, num } from "@/lib/format";
import { getSettings } from "@/lib/settings";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Artikel tidak ditemukan" };
  return {
    title: article.title,
    description: article.excerpt || undefined,
    openGraph: { images: article.cover ? [article.cover] : [], type: "article" },
  };
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article || article.status !== "published") notFound();

  const [others, s] = await Promise.all([getArticles({ limit: 4 }), getSettings()]);
  const related = others.filter((a) => a.id !== article.id).slice(0, 3);
  const readMinutes = Math.max(3, Math.ceil((article.content || "").replace(/<[^>]+>/g, " ").split(/\s+/).length / 200));

  await execute("UPDATE articles SET views = views + 1 WHERE id = ?", [article.id]);

  return (
    <>
      <PageHero
        eyebrow={article.category}
        title={article.title}
        crumbs={[{ label: "Artikel", href: "/artikel" }, { label: article.category }]}
      >
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-white/45">
          <span>{article.author}</span>
          <span className="h-1 w-1 rounded-full bg-white/25" />
          <span>{formatDate(article.published_at)}</span>
          <span className="h-1 w-1 rounded-full bg-white/25" />
          <span className="inline-flex items-center gap-1"><Clock width={12} height={12} /> {readMinutes} menit baca</span>
          <span className="h-1 w-1 rounded-full bg-white/25" />
          <span>{num(article.views)} kali dibaca</span>
        </div>
      </PageHero>

      <section className="container-rei -mt-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:gap-12">
          <article>
            <div className="overflow-hidden rounded-[1.8rem] border border-brand-900/8 bg-white p-2 shadow-soft">
              <div className="relative aspect-[16/8.5] overflow-hidden rounded-[1.4rem] bg-brand-100">
                {article.cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={article.cover} alt={article.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full bg-gradient-to-br from-brand-800 to-brand-950" />
                )}
              </div>
            </div>

            <div className="mt-8 rounded-[1.8rem] border border-brand-900/8 bg-white p-6 shadow-soft sm:p-9">
              <div className="prose-rei" dangerouslySetInnerHTML={{ __html: article.content || "" }} />

              <div className="mt-9 flex flex-col items-start justify-between gap-4 border-t border-brand-900/8 pt-6 sm:flex-row sm:items-center">
                <Link href="/artikel" className="inline-flex items-center gap-2 text-[12px] font-semibold text-brand-700 hover:text-brand-900">
                  <ArrowLeft width={14} height={14} /> Semua artikel
                </Link>
                <div className="flex flex-wrap gap-2">
                  <span className="chip">#{article.category.toLowerCase().replace(/\s/g, "")}</span>
                  <span className="chip">#emasdigital</span>
                  <span className="chip">#rajaemas</span>
                </div>
              </div>
            </div>

            {related.length > 0 && (
              <div className="mt-12">
                <div className="flex items-end justify-between">
                  <h2 className="text-[20px] font-bold tracking-tight text-brand-900">Baca juga</h2>
                  <Link href="/artikel" className="text-[12px] font-semibold text-brand-700">Semua <ArrowUpRight width={12} height={12} /></Link>
                </div>
                <div className="mt-5 grid gap-5 sm:grid-cols-3">
                  {related.map((a) => <ArticleCard key={a.id} article={a} />)}
                </div>
              </div>
            )}
          </article>

          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <div className="overflow-hidden rounded-2xl bg-brand-900 p-5 text-white">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500 text-brand-950"><Smartphone width={18} height={18} /></span>
              <p className="mt-3 font-display text-[19px] leading-snug text-gold-200">Transaksi emas lewat aplikasi</p>
              <p className="mt-1.5 text-[11.5px] leading-relaxed text-white/50">Beli, jual, dan cetak emas fisik melalui aplikasi resmi {s.app_name || "Raja Emas"}. Gratis di Play Store &amp; App Store.</p>
              <ul className="mt-3 space-y-1.5">
                {["Harga beli & buyback real-time", "Mulai dari 0,1 gram", "Cetak emas fisik kapan saja"].map((t) => (
                  <li key={t} className="flex items-center gap-1.5 text-[11px] text-white/60"><Check width={11} height={11} className="text-gold-400" /> {t}</li>
                ))}
              </ul>
              <div className="mt-4">
                <Link href="/aplikasi" className="btn btn-md btn-gold w-full">
                  <Smartphone width={15} height={15} /> Unduh aplikasi
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-gold-500/25 bg-gold-50 p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold-800/70">Catatan</p>
              <p className="mt-2 text-[11px] leading-relaxed text-brand-900/55">
                Artikel ini bersifat edukasi, bukan rekomendasi investasi. Sesuaikan keputusan dengan profil risiko Anda.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
