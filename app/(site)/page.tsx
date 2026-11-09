import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle,
  Coins,
  Gem,
  Lock,
  Printer,
  Quote,
  Shield,
  Smartphone,
  Sparkle,
  Star,
  Users,
  Wallet,
} from "@/components/icons";
import { ArticleCard, ProductCard } from "@/components/site/cards";
import { FaqList } from "@/components/site/faq";
import { PhoneMockup } from "@/components/site/mockups";
import { PriceChart } from "@/components/site/price-chart";
import { Simulator } from "@/components/site/simulator";
import { StoreBadges } from "@/components/site/store-badges";
import { getArticles, getBanners, getFaqs, getLatestPrice, getPreviousPrice, getPriceSeries, getProducts } from "@/lib/content";
import { money, num } from "@/lib/format";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Emas Digital dalam Genggam Anda",
  description:
    "Unduh aplikasi Raja Emas dan beli emas digital murni mulai 0,1 gram. Harga transparan, buyback harian, saldo bisa dicetak menjadi emas fisik. Tersedia di Google Play & App Store.",
};

const features = [
  { icon: Gem, title: "Emas murni 999,9", desc: "Setiap saldo mewakili emas 24 karat yang tercatat dan tersimpan aman." },
  { icon: Printer, title: "Cetak jadi emas fisik", desc: "Ubah saldo digital menjadi batangan fisik dengan pecahan pilihan." },
  { icon: ChartIcon, title: "Harga & buyback transparan", desc: "Harga beli dan buyback diperbarui setiap hari, tanpa biaya tersembunyi." },
  { icon: Lock, title: "Akun terverifikasi", desc: "Verifikasi e-KTP dan wajah menjaga akun serta transaksi Anda." },
  { icon: Wallet, title: "Mulai dari nominal kecil", desc: "Cukup Rp257.000 untuk 0,1 gram. Tidak perlu modal besar." },
  { icon: Shield, title: "Pencatatan berlapis", desc: "Setiap transaksi tercatat rapi dan dapat ditelusuri kapan saja." },
];

function ChartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 20V5M4 20h16" /><path d="m7 15 3.5-4 3 2.5L20 7" />
    </svg>
  );
}

const steps = [
  { n: "01", title: "Daftar & verifikasi", desc: "Buat akun dan lengkapi verifikasi identitas. Cukup beberapa menit dari ponsel.", icon: Users },
  { n: "02", title: "Top up saldo kas", desc: "Isi saldo melalui virtual account atau QRIS sesuai nominal yang Anda pilih.", icon: Wallet },
  { n: "03", title: "Beli emas digital", desc: "Tentukan nominal atau gram. Harga dikunci saat transaksi dikonfirmasi.", icon: Coins },
  { n: "04", title: "Simpan, jual, atau cetak", desc: "Pantau portofolio, jual dengan harga buyback, atau cetak menjadi emas fisik.", icon: Printer },
];

const testimonials = [
  { name: "Rani Puspitasari", role: "Karyawan swasta · Jakarta", quote: "Saya mulai dari 0,5 gram setiap bulan. Sekarang sudah terkumpul lebih dari 12 gram, dan semuanya bisa dipantau dari ponsel.", initial: "RP" },
  { name: "Dimas Prakoso", role: "Wirausaha · Surabaya", quote: "Proses cetak fisiknya jelas dan cepat. Biaya sudah terlihat sejak awal, jadi tidak ada kejutan di akhir.", initial: "DP" },
  { name: "Sinta Maharani", role: "Dosen · Bandung", quote: "Yang membuat saya nyaman adalah transparansi harga buyback. Saya bisa memutuskan kapan waktu yang tepat untuk menjual.", initial: "SM" },
];

export default async function HomePage() {
  const [s, banners, products, latest, prev, series, articles, faqs] = await Promise.all([
    getSettings(),
    getBanners(),
    getProducts({ featured: true }),
    getLatestPrice(),
    getPreviousPrice(),
    getPriceSeries(365),
    getArticles({ limit: 3 }),
    getFaqs(),
  ]);

  const banner = banners[0];
  const price = Number(latest?.buy_price || 0);
  const buyback = Number(latest?.sell_price || 0);
  const delta = price - Number(prev?.buy_price || price);
  const titleParts = (banner?.title || "Miliki emas murni, tanpa repot menyimpannya.").split(",");
  const heroLead = titleParts[0];
  const heroAccent = titleParts.slice(1).join(",").trim();

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* HERO */}
      <section className="relative overflow-hidden hero-glow noise text-white">
        <div className="absolute inset-0 grid-lines opacity-70" />
        <div className="pointer-events-none absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-brand-400/20 blur-3xl" />
        <div className="container-rei relative grid items-center gap-12 pb-24 pt-14 lg:grid-cols-[1.04fr_0.96fr] lg:gap-16 lg:pb-32 lg:pt-20">
          <div>
            <p className="eyebrow eyebrow-light">{banner?.kicker || "Investasi emas digital"}</p>
            <h1 className="mt-5 text-[40px] font-bold leading-[1.04] tracking-[-0.03em] sm:text-[54px] lg:text-[60px]">
              {heroLead},
              {heroAccent && (
                <>
                  <br />
                  <span className="gold-text font-display font-medium italic">{heroAccent}</span>
                </>
              )}
            </h1>
            <p className="mt-6 max-w-[30rem] text-[15px] leading-relaxed text-white/60">
              {banner?.subtitle ||
                "Beli emas digital mulai 0,1 gram dengan harga transparan, proses cepat, dan saldo yang bisa dicetak menjadi emas fisik kapan saja."}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/aplikasi" className="btn btn-lg btn-gold">
                <Smartphone width={17} height={17} /> Unduh aplikasi
              </Link>
              <Link href="#aplikasi" className="btn btn-lg btn-ghost-light">
                Kenali fiturnya <ArrowRight width={17} height={17} />
              </Link>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-white/45">
              <span>Gratis di Google Play &amp; App Store</span>
              <span className="hidden h-1 w-1 rounded-full bg-white/20 sm:inline-block" />
              <span>Transaksi aman dari ponsel</span>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-[11.5px] text-white/55">
              {["Emas 24 karat", "Buyback harian", "Bisa dicetak fisik"].map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5">
                  <CheckCircle width={14} height={14} className="text-gold-400" /> {t}
                </span>
              ))}
            </div>

            <div className="mt-9 flex items-center gap-3 border-t border-white/10 pt-6">
              <div className="flex -space-x-2">
                {["AR", "DW", "BS", "NP"].map((i, idx) => (
                  <span
                    key={i}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-brand-900 text-[9px] font-bold text-brand-950"
                    style={{ background: ["#e1c162", "#d4af37", "#f0e3b8", "#b78e1a"][idx] }}
                  >
                    {i}
                  </span>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 text-gold-400">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} width={11} height={11} fill="currentColor" stroke="none" />)}
                  <span className="ml-1 text-[10px] font-semibold text-white/70">{s.stat_rating || "4,9/5"}</span>
                </div>
                <p className="mt-0.5 text-[10.5px] text-white/45">Dipercaya {s.stat_users || "28.400+"} investor di Indonesia</p>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[460px] lg:max-w-none">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-brand-800 via-brand-900 to-brand-950 px-5 py-9 sm:px-8 lg:py-12">
              <div className="absolute inset-0 grid-lines opacity-50" />
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5" />
              <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gold-500/15 blur-3xl" />
              <div className="absolute left-5 top-5 z-10 inline-flex items-center gap-2 rounded-full border border-white/15 bg-brand-950/50 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-gold-200 backdrop-blur">
                <Sparkle width={12} height={12} /> Aplikasi resmi
              </div>
              <div className="relative flex justify-center pt-6">
                <PhoneMockup price={price} buyback={buyback} />
              </div>
            </div>

            <div className="absolute -left-3 top-1/2 hidden -translate-y-1/2 rounded-2xl border border-white/15 bg-brand-950/70 p-3.5 backdrop-blur-xl sm:block">
              <p className="text-[9px] uppercase tracking-[0.16em] text-white/45">Buyback hari ini</p>
              <p className="num mt-1 text-[15px] font-bold text-gold-300">{money(buyback)}</p>
              <p className="mt-1 text-[9px] text-white/35">per gram</p>
            </div>

            <div className="absolute -right-2 -top-4 hidden h-24 w-24 rotate-6 flex-col items-center justify-center rounded-full border border-gold-300/40 bg-brand-900/80 text-center backdrop-blur-md sm:flex">
              <span className="text-[8px] uppercase tracking-[0.18em] text-gold-300">Mulai dari</span>
              <span className="num mt-0.5 text-lg font-bold text-white">0,1</span>
              <span className="text-[8px] uppercase tracking-widest text-white/45">gram</span>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="container-rei relative z-20 -mt-12 lg:-mt-14">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-brand-900/[0.06] bg-brand-900/[0.06] shadow-lift lg:grid-cols-4">
          {[
            { v: s.stat_users || "28.400+", l: s.stat_customers_label || "Investor aktif" },
            { v: s.stat_volume || "4,2 ton", l: s.stat_volume_label || "Emas terkelola" },
            { v: s.stat_years || "9 tahun", l: s.stat_years_label || "Pengalaman industri" },
            { v: s.stat_rating || "4,9/5", l: s.stat_rating_label || "Rating layanan" },
          ].map((x) => (
            <div key={x.l} className="bg-white px-5 py-6 text-center sm:px-7 sm:py-7">
              <p className="font-display text-[26px] font-semibold leading-none tracking-tight text-brand-900 sm:text-[30px]">{x.v}</p>
              <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.14em] text-brand-900/40">{x.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* VISION */}
      <section className="container-rei mt-14">
        <div className="reveal relative overflow-hidden rounded-[2rem] bg-brand-900 px-6 py-10 text-white sm:px-10 sm:py-12">
          <div className="absolute inset-0 grid-lines opacity-40" />
          <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-gold-500/15 blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <p className="eyebrow eyebrow-light">Visi kami</p>
              <h2 className="mt-4 max-w-2xl text-[28px] font-bold leading-[1.12] tracking-[-0.03em] sm:text-[36px]">
                Menjadi aplikasi emas digital <span className="font-display font-medium italic text-gold-300">No. 1 di Indonesia.</span>
              </h2>
              <p className="mt-4 max-w-xl text-[13px] leading-relaxed text-white/55">
                Kami membangun Raja Emas bukan sekadar aplikasi jual-beli emas, tetapi standar baru
                dalam memiliki emas: aman, transparan, dan bisa dimulai siapa saja dari ponsel.
              </p>
            </div>
            <div className="grid gap-2.5 sm:grid-cols-3 lg:grid-cols-1">
              {["Aman & terpercaya", "Transparan di setiap gram", "Mudah untuk semua orang"].map((t) => (
                <div key={t} className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-[12px] text-white/70">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gold-500/15 text-gold-300">
                    <Check width={11} height={11} />
                  </span>
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="mt-10 overflow-hidden border-y border-brand-900/8 bg-brand-950 py-3 text-white">
        <div className="marquee-track flex w-max items-center gap-10">
          {[...products, ...products, ...products].map((p, i) => (
            <span key={`${p.id}-${i}`} className="flex items-center gap-3 whitespace-nowrap text-[11.5px]">
              <span className="text-gold-400">◆</span>
              <span className="font-medium text-white/60">{p.name}</span>
              <span className="num font-semibold text-gold-200">{money(p.price)}</span>
            </span>
          ))}
        </div>
      </div>

      {/* PRODUCTS */}
      <section className="container-rei pt-20 sm:pt-24">
        <div className="reveal flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="eyebrow">Pilihan produk</p>
            <h2 className="mt-4 text-[32px] font-bold leading-[1.1] tracking-[-0.03em] text-brand-900 sm:text-[40px]">
              Mulai dari yang kecil, <span className="font-display font-medium italic text-brand-600">tumbuh konsisten.</span>
            </h2>
            <p className="mt-4 text-[14px] leading-relaxed text-brand-900/55">
              Pilih pecahan sesuai tujuan Anda. Semua produk terhubung ke satu saldo emas yang bisa dipantau, dijual, atau dicetak.
            </p>
          </div>
          <Link href="/produk" className="btn btn-md btn-outline shrink-0">
            Lihat semua produk <ArrowUpRight width={15} height={15} />
          </Link>
        </div>

        <div className="reveal mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 3).map((p) => <ProductCard key={p.id} product={p} />)}
        </div>

        <div className="reveal mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[11px] text-brand-900/45 sm:justify-start">
          {["Tanpa biaya penyimpanan bulanan", "Pembelian mulai Rp257.000", "Jual kembali kapan saja"].map((t) => (
            <span key={t} className="inline-flex items-center gap-1.5"><Check width={13} height={13} className="text-gold-600" /> {t}</span>
          ))}
        </div>
      </section>

      {/* APP */}
      <section id="aplikasi" className="container-rei mt-24 scroll-mt-24">
        <div className="reveal relative overflow-hidden rounded-[2.5rem] bg-white shadow-soft">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="relative order-2 min-h-[520px] overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 lg:order-1">
              <div className="absolute inset-0 grid-lines opacity-60" />
              <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5" />
              <div className="relative flex h-full items-center justify-center px-6 py-12">
                <PhoneMockup price={price} buyback={buyback} />
              </div>
              <div className="absolute bottom-6 left-6 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 backdrop-blur">
                <p className="text-[9px] uppercase tracking-widest text-white/40">Wallet ID</p>
                <p className="font-mono text-[10px] text-gold-300">REI-8821 · AES-256</p>
              </div>
            </div>

            <div className="order-1 p-7 sm:p-10 lg:order-2 lg:p-12">
              <p className="eyebrow">Aplikasi Raja Emas</p>
              <h2 className="mt-4 text-[30px] font-bold leading-[1.12] tracking-[-0.03em] text-brand-900 sm:text-[38px]">
                Satu aplikasi untuk seluruh <span className="font-display font-medium italic text-brand-600">perjalanan emas</span> Anda.
              </h2>
              <p className="mt-4 text-[14px] leading-relaxed text-brand-900/55">
                Dari pembelian pertama sampai cetak emas fisik, semuanya tercatat rapi. Harga terkini, saldo, dan riwayat transaksi ada dalam satu tampilan.
              </p>

              <div className="mt-7 grid gap-x-6 gap-y-5 sm:grid-cols-2">
                {[
                  { t: "Beli & jual 24/7", d: "Transaksi kapan saja dengan harga harian." },
                  { t: "Cetak emas fisik", d: "Ubah saldo jadi batangan bersertifikat." },
                  { t: "Beli rutin otomatis", d: "Atur nominal dan jadwal sekali saja." },
                  { t: "Riwayat transparan", d: "Semua transaksi tercatat dan bisa diunduh." },
                ].map((f) => (
                  <div key={f.t} className="flex gap-2.5">
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-100 text-gold-700">
                      <Check width={11} height={11} />
                    </span>
                    <div>
                      <p className="text-[12.5px] font-bold text-brand-900">{f.t}</p>
                      <p className="mt-0.5 text-[11.5px] leading-relaxed text-brand-900/50">{f.d}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <StoreBadges playUrl={s.play_store_url} appStoreUrl={s.app_store_url} />
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-brand-900/45">
                  <span>Gratis diunduh · Android &amp; iPhone</span>
                  <Link href="/aplikasi" className="inline-flex items-center gap-1 font-semibold text-brand-700 transition hover:text-brand-900">
                    Lihat fitur aplikasi <ArrowRight width={12} height={12} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SIMULATOR */}
      <section className="container-rei mt-24">
        <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <div className="reveal">
            <p className="eyebrow">Simulasi transaksi</p>
            <h2 className="mt-4 text-[32px] font-bold leading-[1.1] tracking-[-0.03em] text-brand-900 sm:text-[40px]">
              Hitung dulu, <span className="font-display font-medium italic text-brand-600">baru mulai.</span>
            </h2>
            <p className="mt-4 max-w-md text-[14px] leading-relaxed text-brand-900/55">
              Cek berapa gram emas yang Anda dapat dari nominal tertentu, atau estimasi dana saat menjual kembali. Semua berdasarkan harga hari ini.
            </p>

            <div className="mt-7 space-y-3">
              {[
                { icon: ChartIcon, t: "Harga harian", d: "Beli dan buyback diperbarui mengikuti pasar." },
                { icon: Wallet, t: "Nominal fleksibel", d: "Mulai dari Rp257.000 untuk 0,1 gram." },
                { icon: Shield, t: "Simulasi tanpa komitmen", d: "Lanjutkan hanya jika sesuai rencana Anda." },
              ].map((f) => (
                <div key={f.t} className="flex items-start gap-3 rounded-2xl border border-brand-900/8 bg-white/60 p-3.5">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                    <f.icon width={16} height={16} />
                  </span>
                  <div>
                    <p className="text-[12.5px] font-bold text-brand-900">{f.t}</p>
                    <p className="mt-0.5 text-[11.5px] text-brand-900/50">{f.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="reveal">
            <Simulator pricePerGram={price} buybackPerGram={buyback} />
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="mt-24 bg-white py-20 sm:py-24">
        <div className="container-rei">
          <div className="reveal mx-auto max-w-2xl text-center">
            <p className="eyebrow justify-center">Kenapa Raja Emas</p>
            <h2 className="mt-4 text-[32px] font-bold leading-[1.1] tracking-[-0.03em] text-brand-900 sm:text-[40px]">
              Tenang dari awal, <span className="font-display font-medium italic text-brand-600">terukur sampai akhir.</span>
            </h2>
            <p className="mt-4 text-[14px] leading-relaxed text-brand-900/55">
              Kami membangun pengalaman emas digital yang sederhana, tetapi tetap ketat pada keamanan dan transparansi.
            </p>
          </div>

          <div className="reveal mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="group rounded-2xl border border-brand-900/8 bg-cream-50 p-5 transition hover:border-gold-500/40 hover:bg-white hover:shadow-soft">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-900 text-gold-300 transition group-hover:bg-brand-800">
                  <f.icon width={19} height={19} />
                </span>
                <h3 className="mt-4 text-[14px] font-bold text-brand-900">{f.title}</h3>
                <p className="mt-1.5 text-[12px] leading-relaxed text-brand-900/55">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHART */}
      <section className="container-rei pt-24">
        <div className="grid items-start gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14">
          <div className="reveal lg:sticky lg:top-28">
            <p className="eyebrow">Harga emas</p>
            <h2 className="mt-4 text-[32px] font-bold leading-[1.1] tracking-[-0.03em] text-brand-900 sm:text-[40px]">
              Pantau pergerakan, <span className="font-display font-medium italic text-brand-600">ambil keputusan tenang.</span>
            </h2>
            <p className="mt-4 text-[14px] leading-relaxed text-brand-900/55">
              Grafik interaktif harga beli dan buyback per gram. Pilih rentang waktu, arahkan kursor untuk melihat detail harian.
            </p>
            <ul className="mt-6 space-y-2.5 text-[12.5px] text-brand-900/65">
              {["Riwayat hingga 12 bulan", "Harga beli & buyback terpisah", "Pembaruan setiap hari kerja"].map((t) => (
                <li key={t} className="flex items-center gap-2"><Check width={14} height={14} className="text-gold-600" /> {t}</li>
              ))}
            </ul>
            <Link href="/harga" className="btn btn-md btn-primary mt-7">
              Lihat halaman harga <ArrowRight width={15} height={15} />
            </Link>
            <div className="mt-6 flex items-center gap-4 rounded-2xl border border-gold-500/25 bg-gold-50 p-4">
              <span className="font-display text-2xl font-semibold text-gold-800">{num(price / 1000)}</span>
              <p className="text-[11px] leading-relaxed text-brand-900/55">ribuan rupiah per gram hari ini. Harga final mengikuti konfirmasi transaksi.</p>
            </div>
          </div>

          <div className="reveal card p-5 sm:p-7">
            <PriceChart data={series} defaultRange={180} />
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section className="mt-24 bg-cream-200/70 py-20 sm:py-24">
        <div className="container-rei">
          <div className="reveal flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <p className="eyebrow">Cara mulai di aplikasi</p>
              <h2 className="mt-4 text-[32px] font-bold leading-[1.1] tracking-[-0.03em] text-brand-900 sm:text-[40px]">
                Empat langkah, <span className="font-display font-medium italic text-brand-600">tanpa ribet.</span>
              </h2>
            </div>
            <p className="max-w-xs text-[12px] leading-relaxed text-brand-900/50 sm:text-right">
              Semua langkah dilakukan di aplikasi. Rata-rata investor baru menyelesaikan langkah 1–3 dalam waktu kurang dari 15 menit.
            </p>
          </div>

          <div className="reveal mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((st, i) => (
              <div key={st.n} className="relative rounded-2xl border border-brand-900/8 bg-white p-5">
                {i < steps.length - 1 && (
                  <span className="absolute -right-2.5 top-1/2 hidden h-px w-5 bg-gold-500/50 lg:block" />
                )}
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-900 text-gold-300"><st.icon width={18} height={18} /></span>
                  <span className="font-display text-2xl font-semibold text-brand-900/12">{st.n}</span>
                </div>
                <h3 className="mt-4 text-[13.5px] font-bold text-brand-900">{st.title}</h3>
                <p className="mt-1.5 text-[11.5px] leading-relaxed text-brand-900/50">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APP DOWNLOAD BAND */}
      <section className="relative mt-24 overflow-hidden bg-brand-950 text-white noise">
        <div className="absolute inset-0 grid-lines opacity-50" />
        <div className="pointer-events-none absolute -right-24 top-10 h-80 w-80 rounded-full bg-gold-500/12 blur-3xl" />
        <div className="container-rei relative grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div className="reveal">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/25 bg-gold-400/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-gold-300">
              <Smartphone width={12} height={12} /> Transaksi hanya di aplikasi
            </div>
            <h2 className="mt-5 text-[34px] font-bold leading-[1.08] tracking-[-0.03em] sm:text-[42px]">
              Kenali di sini, <span className="font-display font-medium italic text-gold-300">transaksi di aplikasi.</span>
            </h2>
            <p className="mt-4 max-w-lg text-[13.5px] leading-relaxed text-white/55">
              Website ini membantu Anda memahami produk dan harga emas. Untuk membeli, menjual, dan mencetak
              emas fisik, unduh aplikasi {s.app_name || "Raja Emas"} — gratis untuk Android dan iPhone.
            </p>
            <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
              {[
                "Beli & jual emas 24/7",
                "Cetak emas fisik",
                "Harga beli & buyback harian",
                "Riwayat transaksi rapi",
              ].map((t) => (
                <span key={t} className="flex items-center gap-2 text-[12px] text-white/65">
                  <span className="inline-flex h-4.5 w-4.5 items-center justify-center rounded-full bg-gold-500/15 text-gold-300"><Check width={10} height={10} /></span> {t}
                </span>
              ))}
            </div>

            <StoreBadges playUrl={s.play_store_url} appStoreUrl={s.app_store_url} size="lg" className="mt-7 gap-3" />
            <p className="mt-4 text-[10px] text-white/30">Gratis diunduh · Android &amp; iPhone · Tanpa biaya bulanan</p>
          </div>

          <div className="reveal relative flex justify-center">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.12),transparent_65%)]" />
            <PhoneMockup price={price} buyback={buyback} />
          </div>
        </div>
      </section>

      {/* ARTICLES */}
      <section className="container-rei pt-24">
        <div className="reveal flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="eyebrow">Artikel &amp; insight</p>
            <h2 className="mt-4 text-[32px] font-bold leading-[1.1] tracking-[-0.03em] text-brand-900 sm:text-[40px]">
              Belajar dulu, <span className="font-display font-medium italic text-brand-600">tenang kemudian.</span>
            </h2>
          </div>
          <Link href="/artikel" className="btn btn-md btn-outline shrink-0">Semua artikel <ArrowUpRight width={15} height={15} /></Link>
        </div>

        <div className="reveal mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => <ArticleCard key={a.id} article={a} />)}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mt-24 bg-cream-200/70 py-20">
        <div className="container-rei">
          <div className="reveal flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <p className="eyebrow">Cerita investor</p>
              <h2 className="mt-4 text-[32px] font-bold leading-[1.1] tracking-[-0.03em] text-brand-900 sm:text-[40px]">
                Langkah kecil yang <span className="font-display font-medium italic text-brand-600">berarti.</span>
              </h2>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-brand-900/10 bg-white px-4 py-2">
              <div className="flex text-gold-500">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} width={13} height={13} fill="currentColor" stroke="none" />)}
              </div>
              <span className="text-[11px] font-semibold text-brand-900/65">{s.stat_rating || "4,9"} dari 1.200+ ulasan</span>
            </div>
          </div>

          <div className="reveal mt-10 grid gap-5 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.name} className="flex flex-col rounded-2xl border border-brand-900/8 bg-white p-6 shadow-soft">
                <Quote width={22} height={22} className="text-gold-500" />
                <blockquote className="mt-4 flex-1 text-[13px] leading-relaxed text-brand-900/70">“{t.quote}”</blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-brand-900/8 pt-4">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-900 text-[10px] font-bold text-gold-300">{t.initial}</span>
                  <div>
                    <p className="text-[12px] font-bold text-brand-900">{t.name}</p>
                    <p className="text-[10px] text-brand-900/45">{t.role}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-rei pt-24">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div className="reveal">
            <p className="eyebrow">Pertanyaan umum</p>
            <h2 className="mt-4 text-[32px] font-bold leading-[1.1] tracking-[-0.03em] text-brand-900 sm:text-[40px]">
              Masih ragu? <span className="font-display font-medium italic text-brand-600">Ini jawabannya.</span>
            </h2>
            <p className="mt-4 text-[14px] leading-relaxed text-brand-900/55">
              Belum menemukan jawaban yang Anda cari? Tim kami siap membantu pada jam kerja.
            </p>
            <div className="mt-7 rounded-2xl border border-brand-900/8 bg-white p-5">
              <p className="text-[12px] font-bold text-brand-900">Belum yakin cara mulainya?</p>
              <p className="mt-1 text-[11.5px] leading-relaxed text-brand-900/50">Lihat langkah pemasangan, fitur, dan cara kerja aplikasi Raja Emas.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href="/aplikasi" className="btn btn-md btn-primary">Kenali aplikasi <ArrowRight width={14} height={14} /></Link>
              </div>
            </div>
          </div>
          <div className="reveal">
            <FaqList faqs={faqs} />
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="container-rei pt-24">
        <div className="reveal relative overflow-hidden rounded-[2.5rem] bg-brand-900 px-6 py-14 text-center text-white sm:px-12 sm:py-16">
          <div className="absolute inset-0 grid-lines opacity-40" />
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-gold-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-10 h-72 w-72 rounded-full bg-brand-400/20 blur-3xl" />
          <div className="relative mx-auto max-w-2xl">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-gold-400/30 bg-gold-400/10 text-gold-300">
              <Smartphone width={22} height={22} />
            </span>
            <h2 className="mt-5 text-[32px] font-bold leading-[1.08] tracking-[-0.03em] sm:text-[44px]">
              Masa depan finansial dimulai dari <span className="font-display font-medium italic text-gold-300">satu gram pertama.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-[13.5px] leading-relaxed text-white/55">
              Unduh aplikasinya, mulai dari nominal yang nyaman, dan jadilah bagian dari perjalanan kami
              menjadi aplikasi emas digital No. 1 di Indonesia.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/aplikasi" className="btn btn-lg btn-gold"><Smartphone width={17} height={17} /> Unduh aplikasi</Link>
            </div>
            <StoreBadges
              playUrl={s.play_store_url}
              appStoreUrl={s.app_store_url}
              className="mt-4 justify-center"
            />
            <p className="mt-5 text-[10px] text-white/30">Gratis diunduh · Mulai dari Rp257.000 · Buyback harian</p>
          </div>
        </div>
      </section>
    </>
  );
}
