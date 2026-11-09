import Link from "next/link";
import { ArrowRight, Clock, Mail, MapPin, Phone, Smartphone } from "@/components/icons";
import { ContactForm } from "@/components/site/contact-form";
import { PageHero } from "@/components/site/page-hero";
import { getSettings } from "@/lib/settings";

export const metadata = {
  title: "Hubungi Kami",
  description: "Hubungi tim Raja Emas Indonesia untuk informasi aplikasi, produk, cetak emas fisik, atau kerja sama korporasi.",
};

export default async function KontakPage() {
  const s = await getSettings();

  return (
    <>
      <PageHero
        eyebrow="Hubungi kami"
        title={<>Ada yang bisa kami <span className="font-display font-medium italic gold-text">bantu?</span></>}
        description="Tim kami siap menjawab pertanyaan tentang produk, harga, proses cetak emas fisik, maupun kerja sama korporasi."
        crumbs={[{ label: "Kontak" }]}
      />

      <section className="container-rei pt-10">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
          <div className="space-y-4">
            {[
              { icon: Phone, label: "Telepon", value: s.phone || "-", href: `tel:${(s.phone || "").replace(/\s/g, "")}` },
              { icon: Mail, label: "Email", value: s.email || "-", href: `mailto:${s.email}` },
            ].map((x) => (
              <a key={x.label} href={x.href} target={x.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="flex items-center gap-4 rounded-2xl border border-brand-900/8 bg-white p-4 transition hover:border-gold-500/40 hover:shadow-soft">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-900 text-gold-300"><x.icon width={18} height={18} /></span>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-900/40">{x.label}</p>
                  <p className="mt-0.5 truncate text-[13px] font-semibold text-brand-900">{x.value}</p>
                </div>
                <ArrowRight width={15} height={15} className="ml-auto shrink-0 text-brand-900/25" />
              </a>
            ))}

            <div className="rounded-2xl border border-brand-900/8 bg-white p-5">
              <div className="flex gap-3">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700"><MapPin width={17} height={17} /></span>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-900/40">Kantor</p>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-brand-900/70">{s.address}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-3 border-t border-brand-900/8 pt-4">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700"><Clock width={17} height={17} /></span>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-900/40">Jam layanan</p>
                  <p className="mt-1 text-[12.5px] text-brand-900/70">{s.operational_hours || "Senin – Jumat, 09.00 – 17.00 WIB"}</p>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-brand-900/8 bg-brand-900 p-5 text-white">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">Mulai lebih cepat</p>
              <p className="mt-2 font-display text-[19px] leading-snug text-gold-200">Unduh aplikasinya, mulai dari 0,1 gram.</p>
              <p className="mt-1 text-[11.5px] text-white/50">Transaksi beli, jual, dan cetak emas fisik dilakukan melalui aplikasi resmi.</p>
              <Link href="/aplikasi" className="btn btn-md btn-gold mt-4 w-full"><Smartphone width={15} height={15} /> Unduh aplikasi</Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-brand-900/8 bg-white p-6 shadow-soft sm:p-8">
            <p className="eyebrow">Kirim pesan</p>
            <h2 className="mt-3 text-[26px] font-bold tracking-tight text-brand-900">Ceritakan kebutuhan Anda</h2>
            <p className="mt-1.5 text-[12px] leading-relaxed text-brand-900/50">
              Isi formulir di bawah. Tim kami akan menghubungi Anda pada jam kerja, biasanya dalam 1×24 jam.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
            <div className="mt-6 rounded-xl bg-brand-50 p-4 text-[10.5px] leading-relaxed text-brand-900/45">
              Dengan mengirim pesan, Anda menyetujui{" "}
              <Link href="/kebijakan-privasi" className="font-semibold text-brand-700 underline decoration-gold-400 underline-offset-2">Kebijakan Privasi</Link>{" "}
              kami. Kami tidak membagikan data Anda kepada pihak ketiga untuk tujuan pemasaran.
            </div>
          </div>
        </div>

        <div className="mt-10 overflow-hidden rounded-[2rem] border border-brand-900/8 bg-white">
          <div className="grid sm:grid-cols-[1fr_1.2fr]">
            <div className="flex flex-col justify-center p-7">
              <p className="eyebrow">Kunjungi kami</p>
              <h2 className="mt-3 font-display text-[24px] leading-snug text-brand-900">Kantor Raja Emas Indonesia</h2>
              <p className="mt-2 text-[12.5px] leading-relaxed text-brand-900/55">{s.address}</p>
              <p className="mt-4 text-[11px] text-brand-900/40">Kunjungan disarankan dengan janji temu terlebih dahulu.</p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.address || "")}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-md btn-outline mt-5 self-start"
              >
                Buka di Google Maps <ArrowRight width={14} height={14} />
              </a>
            </div>
            <div className="relative min-h-[260px] bg-brand-100">
              <div className="absolute inset-0 grid-lines opacity-40" />
              <div className="absolute inset-0 bg-gradient-to-br from-brand-100 via-brand-50 to-gold-100" />
              <div className="relative flex h-full items-center justify-center p-6">
                <div className="rounded-2xl border border-brand-900/10 bg-white/90 px-5 py-4 text-center shadow-soft backdrop-blur">
                  <span className="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-900 text-gold-300"><MapPin width={19} height={19} /></span>
                  <p className="mt-2 text-[12px] font-bold text-brand-900">CBD BSD, Tangerang Selatan</p>
                  <p className="mt-1 text-[10px] text-brand-900/45">Trembesi Tower · Banten</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
