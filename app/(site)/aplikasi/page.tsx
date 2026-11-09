import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  Calendar,
  CheckCircle,
  Coins,
  DownloadIcon,
  FileText,
  Gem,
  Lock,
  Printer,
  Shield,
  Smartphone,
  Sparkle,
  Star,
  TrendingUp,
  Wallet,
} from "@/components/icons";
import { FaqList } from "@/components/site/faq";
import { PhoneMockup } from "@/components/site/mockups";
import { StoreBadges } from "@/components/site/store-badges";
import { getLatestPrice } from "@/lib/content";
import { getSettings } from "@/lib/settings";
import type { Faq } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Aplikasi Emas Digital — Unduh di Google Play & App Store",
  description:
    "Unduh aplikasi Raja Emas dan mulai investasi emas digital dari 0,1 gram. Beli, jual, dan cetak emas fisik langsung dari ponsel Anda.",
};

const appFeatures = [
  {
    icon: Smartphone,
    title: "Beli & jual dari ponsel",
    desc: "Transaksi emas kapan saja, di mana saja, tanpa perlu datang ke kantor cabang.",
  },
  {
    icon: Printer,
    title: "Cetak emas fisik",
    desc: "Ubah saldo digital menjadi batangan bersertifikat dengan pecahan pilihan.",
  },
  {
    icon: RefreshIcon,
    title: "Beli rutin otomatis",
    desc: "Atur nominal dan jadwal sekali saja, lalu biarkan kebiasaan menabung emas berjalan.",
  },
  {
    icon: TrendingUp,
    title: "Harga & buyback harian",
    desc: "Pantau harga beli dan buyback terbaru sebelum mengambil keputusan.",
  },
  {
    icon: FileText,
    title: "Riwayat transparan",
    desc: "Semua transaksi dan kepemilikan emas tercatat rapi dan bisa ditelusuri.",
  },
  {
    icon: Lock,
    title: "Keamanan berlapis",
    desc: "Verifikasi identitas, PIN transaksi, dan perlindungan akun berlapis.",
  },
];

function RefreshIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 5v5h-5M4 19v-5h5" />
      <path d="M6.2 8.5A7.5 7.5 0 0 1 20 10M4 14a7.5 7.5 0 0 0 13.8 1.5" />
    </svg>
  );
}

const installSteps = [
  {
    n: "01",
    icon: DownloadIcon,
    title: "Unduh aplikasinya",
    desc: "Pilih Google Play untuk Android atau App Store untuk iPhone. Gratis, tanpa biaya unduh.",
  },
  {
    n: "02",
    icon: Shield,
    title: "Daftar & verifikasi",
    desc: "Buat akun dan lengkapi verifikasi e-KTP. Selesai dalam beberapa menit dari ponsel.",
  },
  {
    n: "03",
    icon: Coins,
    title: "Mulai dari 0,1 gram",
    desc: "Isi saldo, tentukan nominal, dan emas digital Anda tercatat di akun.",
  },
];

const appFaqs: Faq[] = [
  {
    id: 9001,
    question: "Apakah aplikasi Raja Emas gratis?",
    answer:
      "Ya. Aplikasi dapat diunduh dan digunakan secara gratis. Tidak ada biaya bulanan untuk menyimpan saldo emas digital Anda.",
    sort_order: 1,
    is_active: 1,
  },
  {
    id: 9002,
    question: "Apa perbedaan aplikasi dengan situs ini?",
    answer:
      "Situs ini membantu Anda memahami produk, harga, dan panduan. Transaksi beli, jual, dan cetak emas fisik dilakukan melalui aplikasi agar akun dan data transaksi Anda terlindungi.",
    sort_order: 2,
    is_active: 1,
  },
  {
    id: 9003,
    question: "Berapa minimal pembelian emas di aplikasi?",
    answer:
      "Anda bisa mulai dari 0,1 gram dengan nominal yang mengikuti harga emas hari ini. Harga final mengikuti konfirmasi saat transaksi.",
    sort_order: 3,
    is_active: 1,
  },
  {
    id: 9004,
    question: "Apakah saldo emas bisa dicetak menjadi emas fisik?",
    answer:
      "Bisa. Saldo emas digital dapat dicetak menjadi batangan fisik bersertifikat melalui menu Cetak di aplikasi, dengan pecahan yang tersedia.",
    sort_order: 4,
    is_active: 1,
  },
  {
    id: 9005,
    question: "Perangkat apa yang didukung?",
    answer:
      "Aplikasi tersedia untuk Android melalui Google Play dan iPhone melalui App Store. Pastikan sistem operasi perangkat Anda sudah diperbarui.",
    sort_order: 5,
    is_active: 1,
  },
];

export default async function AppPage() {
  const [s, latest] = await Promise.all([getSettings(), getLatestPrice()]);
  const price = Number(latest?.buy_price || 0);
  const buyback = Number(latest?.sell_price || 0);
  const appName = s.app_name || "Raja Emas";
  const rating = s.app_rating || "4,9/5";
  const reviews = s.app_reviews || "1.200+ ulasan";

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden hero-glow noise text-white">
        <div className="absolute inset-0 grid-lines opacity-70" />
        <div className="pointer-events-none absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-brand-400/20 blur-3xl" />
        <div className="container-rei relative grid items-center gap-14 pb-20 pt-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16 lg:pb-28 lg:pt-20">
          <div>
            <p className="eyebrow eyebrow-light">
              {s.app_badge || "Aplikasi resmi"} {appName}
            </p>
            <h1 className="mt-5 text-[40px] font-bold leading-[1.04] tracking-[-0.03em] sm:text-[50px] lg:text-[52px]">
              Emas digital,
              <br />
              <span className="gold-text font-display font-medium italic">dalam genggam Anda.</span>
            </h1>
            <p className="mt-6 max-w-[31rem] text-[15px] leading-relaxed text-white/60">
              Beli, jual, dan cetak emas fisik dari satu aplikasi — mulai 0,1 gram dengan harga
              yang diperbarui setiap hari. Gratis diunduh untuk Android dan iPhone.
            </p>

            <div className="mt-8">
              <StoreBadges
                playUrl={s.play_store_url}
                appStoreUrl={s.app_store_url}
                size="lg"
                className="gap-3"
              />
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-[11.5px] text-white/55">
              {["Gratis diunduh", "Android & iPhone", "Tanpa biaya bulanan"].map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5">
                  <CheckCircle width={14} height={14} className="text-gold-400" /> {t}
                </span>
              ))}
            </div>

            <div className="mt-8 flex items-center gap-3 border-t border-white/10 pt-6">
              <div className="flex text-gold-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} width={13} height={13} fill="currentColor" stroke="none" />
                ))}
              </div>
              <p className="text-[11.5px] text-white/55">
                <span className="font-semibold text-white">{rating}</span> · {reviews}
              </p>
            </div>

            <p className="mt-5 max-w-[30rem] text-[11.5px] leading-relaxed text-gold-200/75">
              Dibangun untuk menjadi aplikasi emas digital No. 1 di Indonesia — aman, transparan,
              dan mudah dipakai siapa saja.
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-[440px]">
            <div className="absolute left-1/2 top-1/2 h-[430px] w-[430px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold-400/15" />
            <div className="absolute left-1/2 top-1/2 h-[330px] w-[330px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500/10 blur-3xl" />
            <div className="relative rounded-[2.5rem] bg-gradient-to-br from-gold-400/40 via-white/10 to-transparent p-[1px]">
              <div className="rounded-[2.5rem] bg-brand-900/80 px-6 py-10 backdrop-blur">
                <PhoneMockup price={price} buyback={buyback} />
              </div>
            </div>

            <div className="absolute -left-2 top-12 hidden rounded-2xl border border-white/15 bg-brand-950/75 p-3.5 backdrop-blur-xl sm:block">
              <p className="text-[9px] uppercase tracking-[0.16em] text-white/45">Hari ini</p>
              <p className="num mt-1 text-[15px] font-bold text-gold-300">0,1 gram</p>
              <p className="mt-1 text-[9px] text-white/35">mulai dari</p>
            </div>

            <div className="absolute -right-2 bottom-14 hidden h-24 w-24 rotate-6 flex-col items-center justify-center rounded-full border border-gold-300/40 bg-brand-900/80 text-center backdrop-blur-md sm:flex">
              <Sparkle width={14} height={14} className="mb-1 text-gold-300" />
              <span className="text-[8px] uppercase tracking-[0.16em] text-white/50">Rating</span>
              <span className="num mt-0.5 text-lg font-bold text-white">{rating}</span>
            </div>
          </div>
        </div>

        <div className="relative border-t border-white/10 bg-brand-950/60">
          <div className="container-rei flex flex-wrap items-center justify-center gap-x-10 gap-y-3 py-4 text-[10.5px] uppercase tracking-[0.18em] text-white/40 sm:justify-between">
            <span>Unduh gratis</span>
            <span>Harga harian transparan</span>
            <span>Buyback setiap hari</span>
            <span>Cetak emas fisik</span>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="container-rei pt-20 sm:pt-24">
        <div className="reveal mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center">Di dalam aplikasi</p>
          <h2 className="mt-4 text-[32px] font-bold leading-[1.1] tracking-[-0.03em] text-brand-900 sm:text-[40px]">
            Satu aplikasi untuk <span className="font-display font-medium italic text-brand-600">seluruh perjalanan emas</span> Anda.
          </h2>
          <p className="mt-4 text-[14px] leading-relaxed text-brand-900/55">
            Dari pembelian pertama sampai cetak batangan fisik, semuanya tercatat rapi dalam satu akun.
          </p>
        </div>

        <div className="reveal mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {appFeatures.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-brand-900/8 bg-cream-50 p-5 transition hover:border-gold-500/40 hover:bg-white hover:shadow-soft"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-900 text-gold-300 transition group-hover:bg-brand-800">
                <f.icon width={19} height={19} />
              </span>
              <h3 className="mt-4 text-[14px] font-bold text-brand-900">{f.title}</h3>
              <p className="mt-1.5 text-[12px] leading-relaxed text-brand-900/55">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* INSTALL STEPS */}
      <section className="container-rei mt-24">
        <div className="reveal rounded-[2rem] border border-brand-900/8 bg-white p-6 shadow-soft sm:p-9">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-lg">
              <p className="eyebrow">Mulai dalam 3 langkah</p>
              <h2 className="mt-4 text-[28px] font-bold leading-[1.12] tracking-[-0.03em] text-brand-900 sm:text-[34px]">
                Unduh, verifikasi, <span className="font-display font-medium italic text-brand-600">mulai menabung emas.</span>
              </h2>
            </div>
            <StoreBadges playUrl={s.play_store_url} appStoreUrl={s.app_store_url} tone="light" />
          </div>

          <div className="mt-9 grid gap-4 sm:grid-cols-3">
            {installSteps.map((st, i) => (
              <div key={st.n} className="relative rounded-2xl border border-brand-900/8 bg-cream-50 p-5">
                {i < installSteps.length - 1 && (
                  <span className="absolute -right-2.5 top-1/2 hidden h-px w-5 bg-gold-500/50 sm:block" />
                )}
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-900 text-gold-300">
                    <st.icon width={18} height={18} />
                  </span>
                  <span className="font-display text-2xl font-semibold text-brand-900/12">{st.n}</span>
                </div>
                <h3 className="mt-4 text-[13.5px] font-bold text-brand-900">{st.title}</h3>
                <p className="mt-1.5 text-[11.5px] leading-relaxed text-brand-900/50">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY APP */}
      <section className="mt-24 bg-brand-950 py-20 text-white noise sm:py-24">
        <div className="container-rei grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="reveal relative order-2 flex justify-center lg:order-1">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(212,175,55,0.14),transparent_65%)]" />
            <PhoneMockup price={price} buyback={buyback} />
          </div>
          <div className="reveal order-1 lg:order-2">
            <p className="eyebrow eyebrow-light">Kenapa lewat aplikasi</p>
            <h2 className="mt-4 text-[32px] font-bold leading-[1.1] tracking-[-0.03em] sm:text-[40px]">
              Keputusan lebih cepat, <span className="font-display font-medium italic text-gold-300">catatan lebih rapi.</span>
            </h2>
            <p className="mt-4 max-w-md text-[13.5px] leading-relaxed text-white/55">
              Harga bergerak setiap hari. Aplikasi memastikan Anda melihat angka terbaru dan menyimpan
              bukti transaksi tanpa perlu mencatat manual.
            </p>

            <div className="mt-7 space-y-3">
              {[
                { icon: TrendingUp, t: "Harga beli & buyback real-time", d: "Satu tampilan untuk melihat selisih dan waktu terbaik." },
                { icon: Banknote, t: "Isi saldo fleksibel", d: "Virtual account dan QRIS sesuai nominal pilihan Anda." },
                { icon: Calendar, t: "Pembelian rutin", d: "Jadwalkan pembelian mingguan atau bulanan secara otomatis." },
                { icon: Gem, t: "Saldo = kepemilikan emas", d: "Tercatat dalam gram, siap dijual atau dicetak fisik." },
              ].map((f) => (
                <div key={f.t} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3.5">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold-500/10 text-gold-300">
                    <f.icon width={16} height={16} />
                  </span>
                  <div>
                    <p className="text-[12.5px] font-bold text-white">{f.t}</p>
                    <p className="mt-0.5 text-[11.5px] text-white/50">{f.d}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/harga" className="mt-7 inline-flex items-center gap-2 text-[12px] font-semibold text-gold-300 transition hover:text-gold-200">
              <TrendingUp width={15} height={15} /> Lihat harga emas hari ini
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-rei pt-24">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div className="reveal">
            <p className="eyebrow">Pertanyaan aplikasi</p>
            <h2 className="mt-4 text-[32px] font-bold leading-[1.1] tracking-[-0.03em] text-brand-900 sm:text-[40px]">
              Sebelum mengunduh, <span className="font-display font-medium italic text-brand-600">ini jawabannya.</span>
            </h2>
            <p className="mt-4 text-[14px] leading-relaxed text-brand-900/55">
              Masih ada pertanyaan lain? Tim kami siap membantu pada jam kerja.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              <Link href="/kontak" className="btn btn-md btn-primary">
                Hubungi kami <ArrowRight width={14} height={14} />
              </Link>
              <Link href="/produk" className="btn btn-md btn-outline">
                <Coins width={14} height={14} /> Lihat produk
              </Link>
            </div>
          </div>
          <div className="reveal">
            <FaqList faqs={appFaqs} />
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
              <Wallet width={22} height={22} />
            </span>
            <h2 className="mt-5 text-[32px] font-bold leading-[1.08] tracking-[-0.03em] sm:text-[44px]">
              Mulai gram pertama Anda <span className="font-display font-medium italic text-gold-300">hari ini.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-[13.5px] leading-relaxed text-white/55">
              Unduh aplikasi {appName}, lengkapi verifikasi, dan mulai dari 0,1 gram. Gratis, tanpa biaya bulanan.
            </p>
            <div className="mt-8 flex justify-center">
              <StoreBadges
                playUrl={s.play_store_url}
                appStoreUrl={s.app_store_url}
                size="lg"
                className="justify-center gap-3"
              />
            </div>
            <p className="mt-5 text-[10px] text-white/30">
              Android &amp; iPhone · Harga transparan · Buyback harian
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
