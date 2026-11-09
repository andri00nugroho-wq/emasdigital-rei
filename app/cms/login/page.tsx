import Link from "next/link";
import { ArrowRight, Lock, Mail } from "@/components/icons";
import { login } from "@/lib/actions/admin";

export const metadata = { title: "Masuk CMS" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const sp = await searchParams;

  return (
    <div className="grid min-h-screen bg-cream-100 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="relative hidden overflow-hidden bg-brand-950 lg:block">
        <div className="absolute inset-0 hero-glow opacity-90" />
        <div className="absolute inset-0 grid-lines opacity-60" />
        <div className="relative flex h-full flex-col justify-between p-12">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-rei.png" alt="Raja Emas Indonesia" className="h-11 w-auto self-start" />
          <div>
            <p className="eyebrow eyebrow-light">Content Management System</p>
            <h1 className="mt-5 max-w-md font-display text-[40px] leading-[1.1] text-white">
              Kelola konten emas digital, <span className="italic text-gold-300">dalam satu tempat.</span>
            </h1>
            <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-white/50">
              Perbarui produk, harga harian, artikel, banner, dan pantau pesan masuk dari dasbor yang rapi.
            </p>
            <div className="mt-9 flex gap-6 text-[11px] text-white/40">
              <span>Produk &amp; harga</span>
              <span>Artikel &amp; banner</span>
              <span>Pesan &amp; arsip</span>
            </div>
          </div>
          <p className="text-[10px] text-white/25">© {new Date().getFullYear()} Raja Emas Indonesia</p>
        </div>
      </div>

      <div className="flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-[390px]">
          <div className="lg:hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-rei.png" alt="Raja Emas Indonesia" className="h-10 w-auto" />
          </div>
          <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.2em] text-gold-700 lg:mt-0">Admin panel</p>
          <h2 className="mt-2 text-[30px] font-bold tracking-tight text-brand-900">Selamat datang kembali</h2>
          <p className="mt-2 text-[12.5px] leading-relaxed text-brand-900/50">
            Masuk dengan akun admin untuk mengelola situs Raja Emas Indonesia.
          </p>

          {sp.error && (
            <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-[11.5px] font-medium text-rose-800">
              Email atau kata sandi tidak sesuai. Silakan coba lagi.
            </div>
          )}

          <form action={login} className="mt-7 space-y-4">
            <input type="hidden" name="next" value={sp.next || "/cms"} />
            <div>
              <label className="label" htmlFor="email">Email</label>
              <div className="relative">
                <Mail width={16} height={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-900/30" />
                <input id="email" name="email" type="email" required autoComplete="email" placeholder="admin@rajaemasindonesia.co.id" className="field pl-10" />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="password">Kata sandi</label>
              <div className="relative">
                <Lock width={16} height={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-900/30" />
                <input id="password" name="password" type="password" required autoComplete="current-password" placeholder="••••••••" className="field pl-10" />
              </div>
            </div>
            <button type="submit" className="btn btn-md btn-primary w-full">
              Masuk ke dashboard <ArrowRight width={16} height={16} />
            </button>
          </form>

          <div className="mt-6 rounded-xl border border-brand-900/8 bg-white/60 p-3.5 text-[10.5px] leading-relaxed text-brand-900/45">
            <p className="font-semibold text-brand-900/60">Akun demo</p>
            <p className="mt-1">Email: admin@rajaemasindonesia.co.id</p>
            <p>Kata sandi: AdminREI2026!</p>
          </div>

          <div className="mt-7 flex items-center justify-between text-[11px]">
            <Link href="/" className="font-semibold text-brand-700 hover:text-brand-900">← Kembali ke situs</Link>
            <Link href="/kontak" className="text-brand-900/40 hover:text-brand-700">Butuh bantuan?</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
