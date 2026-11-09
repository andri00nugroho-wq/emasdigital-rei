import { FormActions } from "@/components/cms/ui";
import { saveArticle } from "@/lib/actions/admin";
import type { Article } from "@/lib/types";

const CATEGORIES = ["Tips Investasi", "Edukasi", "Berita", "Panduan", "Analisis"];

function toLocalInput(value: string | null | undefined): string {
  if (!value) return "";
  const d = new Date(value.replace(" ", "T"));
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function ArticleForm({ article }: { article?: Article | null }) {
  return (
    <form action={saveArticle} encType="multipart/form-data" className="grid gap-4 xl:grid-cols-[1.55fr_1fr]">
      {article?.id && <input type="hidden" name="id" value={article.id} />}

      <div className="space-y-4">
        <div className="rounded-2xl border border-brand-900/8 bg-white p-5">
          <p className="text-[12px] font-bold text-brand-900">Isi artikel</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label" htmlFor="title">Judul artikel *</label>
              <input id="title" name="title" required defaultValue={article?.title} className="field" placeholder="Cara mulai investasi emas digital untuk pemula" />
            </div>
            <div>
              <label className="label" htmlFor="slug">Slug URL</label>
              <input id="slug" name="slug" defaultValue={article?.slug} className="field" placeholder="otomatis-dari-judul" />
            </div>
            <div>
              <label className="label" htmlFor="category">Kategori</label>
              <input id="category" name="category" list="article-categories" defaultValue={article?.category || "Tips Investasi"} className="field" />
              <datalist id="article-categories">
                {CATEGORIES.map((c) => <option key={c} value={c} />)}
              </datalist>
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="excerpt">Ringkasan</label>
              <textarea id="excerpt" name="excerpt" rows={2} defaultValue={article?.excerpt || ""} className="field-area" placeholder="Muncul pada kartu artikel dan hasil pencarian (maks. 2–3 baris)." />
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="content">Konten (HTML)</label>
              <textarea id="content" name="content" rows={18} defaultValue={article?.content || ""} className="field-area font-mono text-[11.5px]" placeholder={"<p>Paragraf pembuka…</p>\n<h2>Sub judul</h2>\n<p>Isi bagian…</p>"} />
              <p className="mt-1 text-[10px] text-brand-900/35">Gunakan &lt;p&gt;, &lt;h2&gt;, &lt;h3&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;strong&gt;, &lt;blockquote&gt;. Jangan sertakan &lt;html&gt; atau &lt;body&gt;.</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-brand-900/8 bg-white p-5">
          <p className="text-[12px] font-bold text-brand-900">Publikasi</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="author">Penulis</label>
              <input id="author" name="author" defaultValue={article?.author || "Tim Raja Emas"} className="field" />
            </div>
            <div>
              <label className="label" htmlFor="status">Status</label>
              <select id="status" name="status" defaultValue={article?.status || "published"} className="field">
                <option value="published">Terbit</option>
                <option value="draft">Draf</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="published_at">Tanggal terbit</label>
              <input id="published_at" name="published_at" type="datetime-local" defaultValue={toLocalInput(article?.published_at)} className="field" />
              <p className="mt-1 text-[10px] text-brand-900/35">Kosongkan untuk menggunakan waktu saat ini.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-brand-900/8 bg-white p-5">
          <p className="text-[12px] font-bold text-brand-900">Gambar sampul</p>
          <div className="mt-3 overflow-hidden rounded-xl border border-brand-900/8 bg-brand-50">
            {article?.cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={article.cover} alt="" className="aspect-[16/10] w-full object-cover" />
            ) : (
              <div className="flex aspect-[16/10] items-center justify-center text-[11px] text-brand-900/30">Belum ada sampul</div>
            )}
          </div>
          <div className="mt-3">
            <label className="label" htmlFor="cover_file">Unggah sampul (maks. 12MB)</label>
            <input id="cover_file" name="cover_file" type="file" accept="image/*" className="block w-full text-[11px] text-brand-900/55 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-900 file:px-3 file:py-2 file:text-[11px] file:font-semibold file:text-white" />
          </div>
          <div className="mt-3">
            <label className="label" htmlFor="cover">Atau path gambar</label>
            <input id="cover" name="cover" defaultValue={article?.cover || ""} className="field" placeholder="/images/article-1.png" />
          </div>
          <p className="mt-2 text-[10px] leading-relaxed text-brand-900/35">Rasio ideal 16:10. Unggahan file akan menggantikan path gambar.</p>
        </div>

        <div className="rounded-2xl border border-brand-900/8 bg-gold-50 p-5">
          <p className="text-[11px] font-bold text-brand-900">Tips artikel</p>
          <ul className="mt-2 space-y-1.5 text-[10.5px] leading-relaxed text-brand-900/50">
            <li>• Gunakan judul yang spesifik dan mengandung kata kunci.</li>
            <li>• Bagi konten dengan sub judul H2/H3 agar mudah dibaca.</li>
            <li>• Sertakan ajakan mengunduh aplikasi Raja Emas di akhir artikel.</li>
          </ul>
        </div>

        <FormActions cancelHref="/cms/artikel" label={article ? "Simpan perubahan" : "Terbitkan artikel"} />
      </div>
    </form>
  );
}
