import Link from "next/link";
import { FormActions } from "@/components/cms/ui";
import { saveProduct } from "@/lib/actions/admin";
import type { Product } from "@/lib/types";

export function ProductForm({ product }: { product?: Product | null }) {
  return (
    <form action={saveProduct} encType="multipart/form-data" className="grid gap-4 xl:grid-cols-[1.55fr_1fr]">
      {product?.id && <input type="hidden" name="id" value={product.id} />}

      <div className="space-y-4">
        <div className="rounded-2xl border border-brand-900/8 bg-white p-5">
          <p className="text-[12px] font-bold text-brand-900">Informasi utama</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label" htmlFor="name">Nama produk *</label>
              <input id="name" name="name" required defaultValue={product?.name} className="field" placeholder="Emas Digital 1 gram" />
            </div>
            <div>
              <label className="label" htmlFor="slug">Slug URL</label>
              <input id="slug" name="slug" defaultValue={product?.slug} className="field" placeholder="otomatis-dari-nama" />
            </div>
            <div>
              <label className="label" htmlFor="category">Kategori</label>
              <select id="category" name="category" defaultValue={product?.category || "digital"} className="field">
                <option value="digital">Emas Digital</option>
                <option value="fisik">Emas Fisik</option>
                <option value="gift">Emas Gift</option>
              </select>
            </div>
            <div>
              <label className="label" htmlFor="weight_gram">Berat (gram)</label>
              <input id="weight_gram" name="weight_gram" defaultValue={product?.weight_gram ?? "1"} inputMode="decimal" className="field" />
            </div>
            <div>
              <label className="label" htmlFor="badge">Badge</label>
              <input id="badge" name="badge" defaultValue={product?.badge || ""} className="field" placeholder="Best seller / Paling terjangkau" />
            </div>
            <div>
              <label className="label" htmlFor="price">Harga jual (Rp)</label>
              <input id="price" name="price" defaultValue={product?.price ?? ""} inputMode="numeric" className="field" placeholder="2555000" />
            </div>
            <div>
              <label className="label" htmlFor="buyback_price">Harga buyback (Rp)</label>
              <input id="buyback_price" name="buyback_price" defaultValue={product?.buyback_price ?? ""} inputMode="numeric" className="field" placeholder="2450000" />
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="short_desc">Deskripsi singkat</label>
              <textarea id="short_desc" name="short_desc" rows={2} defaultValue={product?.short_desc || ""} className="field-area" placeholder="Tampil pada kartu produk (maks. 2 baris)." />
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="description">Deskripsi lengkap (HTML)</label>
              <textarea id="description" name="description" rows={9} defaultValue={product?.description || ""} className="field-area font-mono text-[11.5px]" placeholder="<p>Deskripsi produk…</p>" />
              <p className="mt-1 text-[10px] text-brand-900/35">Boleh menggunakan tag HTML dasar seperti &lt;p&gt;, &lt;h3&gt;, &lt;ul&gt;, &lt;strong&gt;.</p>
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="features">Fitur (satu per baris)</label>
              <textarea id="features" name="features" rows={4} defaultValue={(product?.features || []).join("\n")} className="field-area" placeholder={"Emas murni 999,9\nTanpa biaya penyimpanan\nBuyback harian"} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-brand-900/8 bg-white p-5">
          <p className="text-[12px] font-bold text-brand-900">Pengaturan tampilan</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="flex items-center gap-2.5 rounded-xl border border-brand-900/8 p-3 text-[11.5px] text-brand-900/70">
              <input type="checkbox" name="is_active" defaultChecked={product ? Boolean(product.is_active) : true} className="h-4 w-4 accent-brand-700" />
              Tampilkan produk di situs
            </label>
            <label className="flex items-center gap-2.5 rounded-xl border border-brand-900/8 p-3 text-[11.5px] text-brand-900/70">
              <input type="checkbox" name="is_featured" defaultChecked={Boolean(product?.is_featured)} className="h-4 w-4 accent-brand-700" />
              Tampilkan di beranda
            </label>
            <div>
              <label className="label" htmlFor="sort_order">Urutan tampil</label>
              <input id="sort_order" name="sort_order" defaultValue={product?.sort_order ?? 0} inputMode="numeric" className="field" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-brand-900/8 bg-white p-5">
          <p className="text-[12px] font-bold text-brand-900">Gambar produk</p>
          <div className="mt-3 overflow-hidden rounded-xl border border-brand-900/8 bg-brand-50">
            {product?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.image} alt="" className="aspect-[4/3] w-full object-cover" />
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
            <input id="image" name="image" defaultValue={product?.image || ""} className="field" placeholder="/images/product-bar.png" />
          </div>
          <p className="mt-2 text-[10px] leading-relaxed text-brand-900/35">Unggahan file akan menggantikan path gambar. Rasio ideal 4:3.</p>
        </div>

        <div className="rounded-2xl border border-brand-900/8 bg-gold-50 p-5">
          <p className="text-[11px] font-bold text-brand-900">Tips harga</p>
          <p className="mt-2 text-[10.5px] leading-relaxed text-brand-900/50">
            Pastikan harga per gram konsisten dengan harga emas harian di menu Harga Emas. Harga buyback umumnya 2–5% di bawah harga jual.
          </p>
          <Link href="/cms/harga" className="mt-3 inline-flex text-[10.5px] font-semibold text-brand-700 underline decoration-gold-400 underline-offset-2">Buka pengaturan harga →</Link>
        </div>

        <FormActions cancelHref="/cms/produk" label={product ? "Simpan perubahan" : "Tambah produk"} />
      </div>
    </form>
  );
}
