import Link from "next/link";
import { PageHero } from "@/components/site/page-hero";
import { getSettings } from "@/lib/settings";

export const metadata = { title: "Kebijakan Privasi" };

export default async function PrivacyPage() {
  const s = await getSettings();
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Kebijakan Privasi"
        description="Kami menghormati privasi Anda. Halaman ini menjelaskan data apa yang kami kumpulkan dan bagaimana data tersebut digunakan."
        crumbs={[{ label: "Kebijakan Privasi" }]}
      />
      <section className="container-rei pt-10">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-brand-900/8 bg-white p-6 shadow-soft sm:p-10">
          <div className="prose-rei">
            <p><em>Terakhir diperbarui: November 2026</em></p>
            <h2>1. Data yang kami kumpulkan</h2>
            <p>Kami dapat mengumpulkan data yang Anda berikan secara langsung, termasuk nama, nomor telepon, alamat email, dan pesan yang Anda kirimkan melalui formulir di situs ini. Untuk pengguna layanan, kami juga dapat memproses data identitas sesuai kebutuhan verifikasi.</p>
            <h2>2. Penggunaan data</h2>
            <ul>
              <li>Menyediakan materi edukasi dan file yang Anda minta.</li>
              <li>Menjawab pertanyaan dan permintaan dukungan.</li>
              <li>Meningkatkan kualitas layanan dan konten kami.</li>
              <li>Memenuhi kewajiban hukum yang berlaku.</li>
            </ul>
            <h2>3. Berbagi data</h2>
            <p>Kami tidak menjual atau menyewakan data pribadi Anda. Data hanya dapat dibagikan kepada penyedia layanan yang membantu operasional kami dengan kewajiban kerahasiaan, atau kepada otoritas yang berwenang bila diwajibkan hukum.</p>
            <h2>4. Penyimpanan dan keamanan</h2>
            <p>Kami menerapkan langkah teknis dan organisasi yang wajar untuk melindungi data dari akses tidak sah. Meskipun demikian, tidak ada sistem yang sepenuhnya bebas risiko.</p>
            <h2>5. Hak Anda</h2>
            <p>Anda dapat meminta akses, koreksi, atau penghapusan data pribadi Anda dengan menghubungi kami melalui {s.email}. Kami akan menindaklanjuti permintaan sesuai ketentuan yang berlaku.</p>
            <h2>6. Cookie dan analitik</h2>
            <p>Situs ini dapat menggunakan cookie fungsional untuk menjaga pengalaman penggunaan. Kami tidak menggunakan data analitik untuk mengidentifikasi Anda secara pribadi tanpa persetujuan.</p>
            <h2>7. Perubahan kebijakan</h2>
            <p>Kebijakan ini dapat diperbarui dari waktu ke waktu. Versi terbaru akan selalu ditampilkan pada halaman ini.</p>
            <p>Pertanyaan mengenai privasi dapat disampaikan melalui <a href={`mailto:${s.email}`}>{s.email}</a>.</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-2 border-t border-brand-900/8 pt-6">
            <Link href="/syarat-ketentuan" className="btn btn-md btn-outline">Syarat &amp; Ketentuan</Link>
            <Link href="/kontak" className="btn btn-md btn-primary">Hubungi kami</Link>
          </div>
        </div>
      </section>
    </>
  );
}
