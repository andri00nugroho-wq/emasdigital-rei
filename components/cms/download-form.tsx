import { FormActions } from "@/components/cms/ui";
import { saveDownload } from "@/lib/actions/admin";
import type { DownloadItem } from "@/lib/types";

export function DownloadForm({ item }: { item?: DownloadItem | null }) {
  const isPdf = item?.file_path?.toLowerCase().endsWith(".pdf");
  return (
    <form action={saveDownload} encType="multipart/form-data" className="grid gap-4 xl:grid-cols-[1.45fr_1fr]">
      {item?.id && <input type="hidden" name="id" value={item.id} />}

      <div className="space-y-4">
        <div className="rounded-2xl border border-brand-900/8 bg-white p-5">
          <p className="text-[12px] font-bold text-brand-900">Informasi file</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label" htmlFor="title">Judul file *</label>
              <input id="title" name="title" required defaultValue={item?.title} className="field" placeholder="Panduan Investasi Emas Digital" />
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="slug">Slug</label>
              <input id="slug" name="slug" defaultValue={item?.slug} className="field" placeholder="otomatis-dari-judul" />
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="description">Deskripsi</label>
              <textarea id="description" name="description" rows={3} defaultValue={item?.description || ""} className="field-area" placeholder="Ringkasan isi file untuk catatan internal." />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-brand-900/8 bg-white p-5">
          <p className="text-[12px] font-bold text-brand-900">Sumber file</p>
          <div className="mt-4 space-y-4">
            <div>
              <label className="label" htmlFor="file_file">Unggah file (PDF, maks. 12MB)</label>
              <input id="file_file" name="file_file" type="file" accept="application/pdf,application/octet-stream" className="block w-full text-[11px] text-brand-900/55 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-900 file:px-3 file:py-2 file:text-[11px] file:font-semibold file:text-white" />
            </div>
            <div>
              <label className="label" htmlFor="file_path">Atau path file</label>
              <input id="file_path" name="file_path" defaultValue={item?.file_path || ""} className="field" placeholder="/downloads/panduan-investasi-emas-digital.pdf" />
              <p className="mt-1 text-[10px] text-brand-900/35">Unggahan baru akan menggantikan file lama. Kosongkan path bila mengunggah file.</p>
            </div>
            {item && (
              <div className="rounded-xl border border-brand-900/8 bg-brand-50/60 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-brand-900/40">File saat ini</p>
                <div className="mt-1.5 flex items-center justify-between gap-3">
                  <span className="truncate font-mono text-[10.5px] text-brand-900/60">{item.file_path}</span>
                  <a href={item.file_path} target="_blank" rel="noreferrer" className="shrink-0 text-[10.5px] font-semibold text-brand-700 underline decoration-gold-400 underline-offset-2">Buka</a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-brand-900/8 bg-white p-5">
          <p className="text-[12px] font-bold text-brand-900">Status</p>
          <div className="mt-4 space-y-3">
            <label className="flex items-center gap-2.5 rounded-xl border border-brand-900/8 p-3 text-[11.5px] text-brand-900/70">
              <input type="checkbox" name="is_active" defaultChecked={item ? Boolean(item.is_active) : true} className="h-4 w-4 accent-brand-700" />
              Tandai aktif di arsip
            </label>
            {item && (
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-brand-50 p-3 text-center">
                  <p className="num text-[18px] font-bold text-brand-900">{item.download_count.toLocaleString("id-ID")}</p>
                  <p className="text-[9px] uppercase tracking-wider text-brand-900/40">Unduhan</p>
                </div>
                <div className="rounded-xl bg-gold-50 p-3 text-center">
                  <p className="num text-[18px] font-bold text-brand-900">{(item.leads_count ?? 0).toLocaleString("id-ID")}</p>
                  <p className="text-[9px] uppercase tracking-wider text-brand-900/40">Leads</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-brand-900/8 bg-gold-50 p-5">
          <p className="text-[11px] font-bold text-brand-900">Catatan arsip</p>
          <p className="mt-2 text-[10.5px] leading-relaxed text-brand-900/50">
            {isPdf ? "File PDF tersimpan dengan aman. " : ""}Arsip ini tidak lagi ditampilkan di situs publik. Funnel utama sekarang adalah unduhan aplikasi melalui halaman /aplikasi.
          </p>
        </div>

        <FormActions cancelHref="/cms/download" label={item ? "Simpan perubahan" : "Tambah file"} />
      </div>
    </form>
  );
}
