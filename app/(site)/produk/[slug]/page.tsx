import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Printer, Shield, Smartphone } from "@/components/icons";
import { ProductCard } from "@/components/site/cards";
import { PageHero } from "@/components/site/page-hero";
import { Simulator } from "@/components/site/simulator";
import { CATEGORY_LABEL, getLatestPrice, getProductBySlug, getRelatedProducts } from "@/lib/content";
import { money, num } from "@/lib/format";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Produk tidak ditemukan" };
  return {
    title: product.name,
    description: product.short_desc || `Kenali ${product.name} dari Raja Emas Indonesia, tersedia melalui aplikasi resmi.`,
    openGraph: { images: product.image ? [product.image] : [] },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [product, latest] = await Promise.all([getProductBySlug(slug), getLatestPrice()]);
  if (!product || !product.is_active) notFound();

  const related = await getRelatedProducts(product.slug, product.category);
  const perGram = Number(product.price) / Number(product.weight_gram || 1);
  const price = Number(latest?.buy_price || perGram);
  const buyback = Number(latest?.sell_price || price * 0.955);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.short_desc,
    image: product.image,
    brand: { "@type": "Brand", name: "Raja Emas Indonesia" },
    offers: {
      "@type": "Offer",
      priceCurrency: "IDR",
      price: product.price,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero
        eyebrow={CATEGORY_LABEL[product.category] || product.category}
        title={product.name}
        description={product.short_desc || undefined}
        crumbs={[{ label: "Produk", href: "/produk" }, { label: product.name }]}
      />

      <section className="container-rei pt-10">
        <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12">
          <div>
            <div className="overflow-hidden rounded-[2rem] border border-brand-900/8 bg-white p-3 shadow-soft">
              <div className="relative aspect-[4/3.4] overflow-hidden rounded-[1.5rem] bg-brand-50">
                {product.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-brand-800 to-brand-950 font-display text-4xl text-gold-300">REI</div>
                )}
                {product.badge && (
                  <span className="absolute left-4 top-4 rounded-full bg-brand-950/85 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gold-200 backdrop-blur">
                    {product.badge}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                { icon: Shield, t: "Tercatat aman" },
                { icon: Printer, t: "Bisa dicetak" },
                { icon: Check, t: "Emas 999,9" },
              ].map((x) => (
                <div key={x.t} className="flex flex-col items-center gap-1.5 rounded-xl border border-brand-900/8 bg-white px-2 py-3 text-center">
                  <x.icon width={17} height={17} className="text-brand-700" />
                  <span className="text-[10px] font-semibold text-brand-900/60">{x.t}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-900/40">
              {CATEGORY_LABEL[product.category] || product.category} · {num(product.weight_gram, 3)} gram
            </p>
            <h2 className="mt-2 font-display text-[30px] font-semibold leading-tight text-brand-900">{product.name}</h2>

            <div className="mt-5 rounded-2xl border border-brand-900/8 bg-white p-5 shadow-soft">
              <p className="text-[10px] uppercase tracking-[0.18em] text-brand-900/40">Harga hari ini</p>
              <p className="num mt-1 text-[34px] font-bold tracking-tight text-brand-900">{money(product.price)}</p>
              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-brand-900/8 pt-4">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-brand-900/40">Buyback</p>
                  <p className="num mt-0.5 text-[14px] font-semibold text-brand-900/75">{money(product.buyback_price)}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-brand-900/40">Harga / gram</p>
                  <p className="num mt-0.5 text-[14px] font-semibold text-brand-900/75">{money(perGram)}</p>
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
              <Link href="/aplikasi" className="btn btn-lg btn-gold flex-1">
                <Smartphone width={17} height={17} /> Mulai di aplikasi
              </Link>
              <Link href="/harga" className="btn btn-lg btn-outline flex-1">
                Lihat harga hari ini
              </Link>
            </div>

            <ul className="mt-6 space-y-2.5">
              {product.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-[12.5px] text-brand-900/65">
                  <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-gold-100 text-gold-700">
                    <Check width={10} height={10} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            <p className="mt-6 flex items-center gap-2 rounded-xl bg-brand-50 px-3.5 py-2.5 text-[10.5px] text-brand-900/50">
              <Shield width={14} height={14} className="shrink-0 text-brand-600" />
              Halaman ini bersifat informasi. Seluruh transaksi dilakukan melalui aplikasi; harga final mengikuti konfirmasi saat transaksi.
            </p>
          </div>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <div>
            <h2 className="text-[22px] font-bold tracking-tight text-brand-900">Detail produk</h2>
            <div className="prose-rei mt-4" dangerouslySetInnerHTML={{ __html: product.description || "" }} />
          </div>
          <div>
            <Simulator pricePerGram={price} buybackPerGram={buyback} />
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-16">
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-[22px] font-bold tracking-tight text-brand-900">Produk terkait</h2>
              <Link href="/produk" className="text-[12px] font-semibold text-brand-700 hover:text-brand-900">Lihat semua</Link>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}

        <div className="mt-14 flex flex-col items-center justify-between gap-4 rounded-2xl border border-brand-900/8 bg-white p-6 sm:flex-row">
          <div>
            <p className="text-[13px] font-bold text-brand-900">Transaksi hanya di aplikasi</p>
            <p className="mt-1 text-[11.5px] text-brand-900/50">Semua pembelian, penjualan, dan cetak emas fisik dilakukan melalui aplikasi resmi Raja Emas.</p>
          </div>
          <Link href="/aplikasi" className="btn btn-md btn-primary"><Smartphone width={16} height={16} /> Unduh aplikasi</Link>
        </div>
      </section>
    </>
  );
}
