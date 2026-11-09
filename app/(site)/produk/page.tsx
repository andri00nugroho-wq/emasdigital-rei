import Link from "next/link";
import { Check, Smartphone } from "@/components/icons";
import { ProductCard } from "@/components/site/cards";
import { PageHero } from "@/components/site/page-hero";
import { getLatestPrice, getProducts, CATEGORY_LABEL } from "@/lib/content";
import { money } from "@/lib/format";

export const metadata = {
  title: "Produk Emas Digital",
  description: "Pilih emas digital, emas fisik, atau emas gift dari Raja Emas Indonesia. Mulai 0,1 gram dengan harga transparan.",
};

const TABS = [
  { key: "semua", label: "Semua produk" },
  { key: "digital", label: "Emas Digital" },
  { key: "fisik", label: "Emas Fisik" },
  { key: "gift", label: "Emas Gift" },
];

export default async function ProdukPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string }>;
}) {
  const sp = await searchParams;
  const category = sp.kategori && CATEGORY_LABEL[sp.kategori] ? sp.kategori : "semua";
  const [products, latest] = await Promise.all([
    getProducts({ category }),
    getLatestPrice(),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Katalog emas"
        title={<>Pilih pecahan yang <span className="font-display font-medium italic gold-text">sesuai tujuanmu.</span></>}
        description="Dari 0,1 gram untuk langkah pertama, sampai batangan fisik untuk tujuan jangka panjang. Semua dalam satu saldo emas yang mudah dikelola."
        crumbs={[{ label: "Produk" }]}
      >
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11.5px] text-white/55">
          <span className="inline-flex items-center gap-1.5"><Check width={13} height={13} className="text-gold-400" /> Harga hari ini {money(latest?.buy_price)}/gram</span>
          <span className="inline-flex items-center gap-1.5"><Check width={13} height={13} className="text-gold-400" /> Tanpa biaya penyimpanan</span>
          <span className="inline-flex items-center gap-1.5"><Check width={13} height={13} className="text-gold-400" /> Buyback harian</span>
        </div>
      </PageHero>

      <section className="container-rei pt-12">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-brand-900/8 bg-white p-2 shadow-soft">
          <div className="flex flex-wrap gap-1">
            {TABS.map((t) => {
              const active = category === t.key;
              return (
                <Link
                  key={t.key}
                  href={t.key === "semua" ? "/produk" : `/produk?kategori=${t.key}`}
                  className={`rounded-xl px-4 py-2.5 text-[12.5px] font-semibold transition ${
                    active ? "bg-brand-900 text-white" : "text-brand-900/55 hover:bg-brand-50 hover:text-brand-900"
                  }`}
                >
                  {t.label}
                </Link>
              );
            })}
          </div>
          <p className="px-3 text-[11px] text-brand-900/40">{products.length} produk tersedia</p>
        </div>

        {products.length > 0 ? (
          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="mt-10 rounded-3xl border border-dashed border-brand-900/15 p-12 text-center">
            <p className="font-display text-xl text-brand-900">Belum ada produk pada kategori ini.</p>
            <Link href="/produk" className="btn btn-md btn-primary mt-5">Lihat semua produk</Link>
          </div>
        )}

        <div className="mt-12 grid gap-4 rounded-3xl bg-brand-900 p-7 text-white sm:grid-cols-[1fr_auto] sm:items-center sm:p-9">
          <div>
            <p className="eyebrow eyebrow-light">Siap mulai?</p>
            <p className="mt-2 max-w-xl text-[17px] font-semibold leading-snug">
              Unduh aplikasinya dan lihat pecahan pilihan Anda langsung dari ponsel.
            </p>
            <p className="mt-1.5 max-w-lg text-[11.5px] leading-relaxed text-white/50">
              Halaman ini bersifat informasi. Seluruh transaksi beli, jual, dan cetak emas dilakukan melalui aplikasi.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link href="/aplikasi" className="btn btn-md btn-gold"><Smartphone width={16} height={16} /> Unduh aplikasi</Link>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-brand-900/8 bg-white/60 p-4 text-[11px] leading-relaxed text-brand-900/45">
          Harga produk ditampilkan sebagai estimasi dan mengikuti harga emas harian. Harga final dikonfirmasi sebelum transaksi. Investasi emas mengandung risiko fluktuasi harga.
        </div>
      </section>
    </>
  );
}
