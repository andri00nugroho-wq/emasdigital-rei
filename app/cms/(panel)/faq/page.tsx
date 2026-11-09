import { Plus } from "@/components/icons";
import { ConfirmSubmit } from "@/components/cms/confirm";
import { Card, Empty, Flash, PageHead, StatusBadge } from "@/components/cms/ui";
import { deleteFaq, saveFaq, saveFaqBulk } from "@/lib/actions/admin";
import { query } from "@/lib/db";
import type { Faq } from "@/lib/types";

export const metadata = { title: "FAQ — CMS" };

export default async function CmsFaqPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const faqs = await query<Faq>("SELECT * FROM faqs ORDER BY sort_order ASC, id ASC");

  return (
    <>
      <PageHead
        title="FAQ"
        description="Pertanyaan yang tampil di beranda. Jawaban singkat dan jelas membantu meningkatkan konversi."
      />
      <Flash saved={sp.saved} deleted={sp.deleted} error={sp.error} />

      <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <div>
          {faqs.length === 0 ? (
            <Card><Empty title="Belum ada FAQ" desc="Tambahkan pertanyaan pertama melalui formulir di samping." /></Card>
          ) : (
            <>
              <form id="faq-bulk" action={saveFaqBulk} />
              <div className="space-y-3">
                {faqs.map((f) => (
                  <Card key={f.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <StatusBadge active={Boolean(f.is_active)} />
                          <span className="text-[9.5px] text-brand-900/30">Urutan {f.sort_order}</span>
                        </div>
                        <input type="hidden" name="faq_id" value={f.id} form="faq-bulk" />
                        <label className="label" htmlFor={`q_${f.id}`}>Pertanyaan</label>
                        <input id={`q_${f.id}`} name={`q_${f.id}`} defaultValue={f.question} form="faq-bulk" className="field" />
                        <label className="label mt-3" htmlFor={`a_${f.id}`}>Jawaban</label>
                        <textarea id={`a_${f.id}`} name={`a_${f.id}`} defaultValue={f.answer} rows={3} form="faq-bulk" className="field-area" />
                        <label className="mt-3 flex items-center gap-2 text-[11px] text-brand-900/60">
                          <input type="checkbox" name={`active_${f.id}`} defaultChecked={Boolean(f.is_active)} form="faq-bulk" className="h-3.5 w-3.5 accent-brand-700" />
                          Tampilkan di situs
                        </label>
                      </div>
                      <form action={deleteFaq}>
                        <input type="hidden" name="id" value={f.id} />
                        <ConfirmSubmit />
                      </form>
                    </div>
                  </Card>
                ))}
              </div>
              <div className="mt-4 flex justify-end">
                <button type="submit" form="faq-bulk" className="btn btn-md btn-primary">Simpan semua FAQ</button>
              </div>
            </>
          )}
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <p className="text-[12px] font-bold text-brand-900">Tambah FAQ baru</p>
            <form action={saveFaq} className="mt-4 space-y-3">
              <div>
                <label className="label" htmlFor="question">Pertanyaan *</label>
                <input id="question" name="question" required className="field" placeholder="Apakah emas saya aman?" />
              </div>
              <div>
                <label className="label" htmlFor="answer">Jawaban *</label>
                <textarea id="answer" name="answer" required rows={4} className="field-area" placeholder="Emas disimpan di..." />
              </div>
              <div>
                <label className="label" htmlFor="sort_order">Urutan tampil</label>
                <input id="sort_order" name="sort_order" defaultValue={faqs.length + 1} inputMode="numeric" className="field" />
              </div>
              <button type="submit" className="btn btn-md btn-primary w-full"><Plus width={14} height={14} /> Tambah FAQ</button>
            </form>
          </Card>

          <Card className="bg-gold-50 p-5">
            <p className="text-[11px] font-bold text-brand-900">Tips menjawab</p>
            <ul className="mt-2 space-y-1.5 text-[10.5px] leading-relaxed text-brand-900/55">
              <li>• Jawab maksimal 3–4 baris agar mudah dibaca.</li>
              <li>• Sebutkan angka atau jaminan yang spesifik.</li>
              <li>• Arahkan ke halaman terkait bila perlu.</li>
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}
