import { FormActions } from "@/components/cms/ui";
import { saveBanner } from "@/lib/actions/admin";
import type { Banner } from "@/lib/types";

export function BannerForm({ banner }: { banner?: Banner | null }) {
  return (
    <form action={saveBanner} encType="multipart/form-data" className="grid gap-4 xl:grid-cols-[1.45fr_1fr]">
      {banner?.id && <input type="hidden" name="id" value={banner.id} />}

      <div className="space-y-4">
        <div className="rounded-2xl border border-brand-900/8 bg-white p-5">
          <p className="text-[12px] font-bold text-brand-900">Konten banner</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label" htmlFor="kicker">Label kecil (kicker)</label>
              <input id="kicker" name="kicker" defaultValue={banner?.kicker || ""} className="field" placeholder="Investasi emas digital" />
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="title">Judul utama *</label>
              <input id="title" name="title" required defaultValue={banner?.title} className="field" placeholder="Masa depan emas, dimulai hari ini" />
              <p className="mt-1 text-[10px] text-brand-900/35">Gunakan koma untuk memisahkan bagian yang akan diberi aksen emas miring.</p>
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="subtitle">Subjudul</label>
              <textarea id="subtitle" name="subtitle" rows={3} defaultValue={banner?.subtitle || ""} className="field-area" placeholder="Beli emas murni mulai dari Rp10.000, kapan pun dan di mana pun." />
            </div>
            <div>
              <label className="label" htmlFor="cta_label">Label tombol</label>
              <input id="cta_label" name="cta_label" defaultValue={banner?.cta_label || ""} className="field" placeholder="Mulai investasi" />
            </div>
            <div>
              <label className="label" htmlFor="cta_url">URL tombol</label>
              <input id="cta_url" name="cta_url" defaultValue={banner?.cta_url || ""} className="field" placeholder="/produk" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-brand-900/8 bg-white p-5">
          <p className="text-[12px] font-bold text-brand-900">Pengaturan</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="flex items-center gap-2.5 rounded-xl border border-brand-900/8 p-3 text-[11.5px] text-brand-900/70">
              <input type="checkbox" name="is_active" defaultChecked={banner ? Boolean(banner.is_active) : true} className="h-4 w-4 accent-brand-700" />
              Tampilkan banner di beranda
            </label>
            <div>
              <label className="label" htmlFor="sort_order">Urutan tampil</label>
              <input id="sort_order" name="sort_order" defaultValue={banner?.sort_order ?? 0} inputMode="numeric" className="field" />
            </div>
          </div>
          <p className="mt-3 text-[10px] leading-relaxed text-brand-900/40">
            Banner dengan urutan terkecil dan status aktif akan digunakan sebagai hero beranda.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-brand-900/8 bg-white p-5">
          <p className="text-[12px] font-bold text-brand-900">Gambar banner</p>
          <div className="mt-3 overflow-hidden rounded-xl border border-brand-900/8 bg-brand-50">
            {banner?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={banner.image} alt="" className="aspect-[4/3] w-full object-cover" />
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center text-[11px] text-brand-900/30">Belum ada gambar</div>
            )}
          </div>
          <div className="mt-3">
            <label className="label" htmlFor="image_file">Unggah gambar (maks. 12MB)</label>
            <input id="image_file" name="image_file" type="file" accept="image/*" className="block w-full text-[11px] text-brand-900/55 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-900 file:px-3 file:py-2 file:text-[11px] file:font-semibold file:text-white" />
          </div>
          <div className="mt-3">
            <label className="label" htmlFor="image">Atau path gambar</label>
            <input id="image" name="image" defaultValue={banner?.image || ""} className="field" placeholder="/images/hero-gold.png" />
          </div>
        </div>

        <FormActions cancelHref="/cms/banner" label={banner ? "Simpan perubahan" : "Tambah banner"} />
      </div>
    </form>
  );
}
