import Link from "next/link";
import { ArrowRight, Compass } from "@/components/icons";

export default function NotFound() {
  return (
    <section className="container-rei flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-900 text-gold-300">
        <Compass width={26} height={26} />
      </span>
      <p className="mt-6 font-display text-[64px] leading-none text-brand-900/15">404</p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-brand-900">Halaman tidak ditemukan</h1>
      <p className="mt-2 max-w-md text-[13px] leading-relaxed text-brand-900/55">
        Halaman yang Anda cari mungkin sudah dipindahkan. Mulai kembali dari beranda atau lihat produk emas kami.
      </p>
      <div className="mt-7 flex flex-col gap-2 sm:flex-row">
        <Link href="/" className="btn btn-md btn-primary">Kembali ke beranda <ArrowRight width={15} height={15} /></Link>
        <Link href="/produk" className="btn btn-md btn-outline">Lihat produk</Link>
      </div>
    </section>
  );
}
