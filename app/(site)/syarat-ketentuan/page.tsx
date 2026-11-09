import Link from "next/link";
import { PageHero } from "@/components/site/page-hero";
import { getSettings } from "@/lib/settings";

export const metadata = { title: "Syarat & Ketentuan" };

export default async function TermsPage() {
  const s = await getSettings();
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Syarat & Ketentuan"
        description="Ketentuan penggunaan situs dan layanan informasi Raja Emas Indonesia."
        crumbs={[{ label: "Syarat & Ketentuan" }]}
      />
      <section className="container-rei pt-10">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-brand-900/8 bg-white p-6 shadow-soft sm:p-10">
          <div className="prose-rei">
            <p><em>Terakhir diperbarui: November 2026</em></p>
            <h2>1. Penerimaan ketentuan</h2>
            <p>Dengan mengakses situs ini, Anda menyetujui syarat dan ketentuan yang berlaku. Jika tidak setuju, mohon hentikan penggunaan situs.</p>
            <h2>2. Informasi produk dan harga</h2>
            <p>Harga yang ditampilkan merupakan informasi indikatif dan dapat berubah mengikuti harga emas harian. Harga final untuk setiap transaksi dikonfirmasi oleh tim kami sebelum pembayaran.</p>
            <h2>3. Bukan nasihat keuangan</h2>
            <p>Seluruh konten edukasi di situs ini bersifat informasi umum dan bukan rekomendasi investasi. Keputusan investasi sepenuhnya menjadi tanggung jawab Anda. Investasi emas mengandung risiko fluktuasi harga dan tidak menjamin keuntungan.</p>
            <h2>4. Penggunaan yang wajar</h2>
            <p>Anda setuju untuk tidak menyalahgunakan situs, termasuk menyebarkan materi yang menyesatkan, melakukan akses tidak sah, atau mengganggu layanan.</p>
            <h2>5. Hak kekayaan intelektual</h2>
            <p>Logo, materi, dan konten di situs ini dilindungi hukum yang berlaku. Penggunaan komersial tanpa izin tertulis tidak diperbolehkan.</p>
            <h2>6. Batasan tanggung jawab</h2>
            <p>Kami berupaya menjaga akurasi informasi, namun tidak bertanggung jawab atas kerugian yang timbul dari keputusan yang dibuat berdasarkan informasi di situs ini, sejauh diizinkan hukum.</p>
            <h2>7. Kontak</h2>
            <p>Pertanyaan mengenai ketentuan ini dapat disampaikan melalui <a href={`mailto:${s.email}`}>{s.email}</a> atau {s.phone}.</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-2 border-t border-brand-900/8 pt-6">
            <Link href="/kebijakan-privasi" className="btn btn-md btn-outline">Kebijakan Privasi</Link>
            <Link href="/kontak" className="btn btn-md btn-primary">Hubungi kami</Link>
          </div>
        </div>
      </section>
    </>
  );
}
