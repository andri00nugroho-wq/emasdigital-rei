import Link from "next/link";
import { DownloadIcon, Pencil, Plus } from "@/components/icons";
import { ConfirmSubmit } from "@/components/cms/confirm";
import { Card, Empty, Flash, PageHead, StatusBadge, TableWrap, Td, Th } from "@/components/cms/ui";
import { deleteDownload } from "@/lib/actions/admin";
import { query } from "@/lib/db";

export const metadata = { title: "Arsip Panduan — CMS" };

type Row = {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  file_path: string;
  download_count: number;
  is_active: boolean;
  leads_count: number;
};

export default async function CmsDownloadsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const items = await query<Row>(
    `SELECT d.id, d.slug, d.title, d.description, d.file_path, d.download_count, d.is_active,
            (SELECT COUNT(*) FROM leads l WHERE l.download_id = d.id) AS leads_count
     FROM downloads d ORDER BY d.id ASC`
  );
  const totalDownloads = items.reduce((sum, i) => sum + Number(i.download_count), 0);
  const totalLeads = items.reduce((sum, i) => sum + Number(i.leads_count), 0);

  return (
    <>
      <PageHead
        title="Arsip Panduan"
        description="Arsip lead magnet lama. Modul ini tidak lagi tampil di situs publik — funnel utama sekarang unduhan aplikasi."
        actions={<Link href="/cms/download/baru" className="btn btn-md btn-primary"><Plus width={15} height={15} /> Tambah file</Link>}
      />
      <Flash saved={sp.saved} deleted={sp.deleted} error={sp.error} />

      <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-[11px] leading-relaxed text-amber-900/80">
        <strong>Arsip saja.</strong> Halaman publik <code className="rounded bg-amber-100 px-1">/download</code> dialihkan ke{" "}
        <Link href="/aplikasi" className="font-semibold underline">/aplikasi</Link>. Gunakan menu{" "}
        <Link href="/cms/pengaturan" className="font-semibold underline">Pengaturan Situs</Link> untuk mengelola tautan Play Store dan App Store.
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-brand-900/8 bg-white p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-900/40">Total file</p>
          <p className="num mt-1 text-[22px] font-bold text-brand-900">{items.length}</p>
        </div>
        <div className="rounded-2xl border border-brand-900/8 bg-white p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-900/40">Total unduhan</p>
          <p className="num mt-1 text-[22px] font-bold text-brand-900">{totalDownloads.toLocaleString("id-ID")}</p>
        </div>
        <div className="rounded-2xl border border-brand-900/8 bg-gold-50 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-900/40">Leads terkumpul</p>
          <p className="num mt-1 text-[22px] font-bold text-brand-900">{totalLeads.toLocaleString("id-ID")}</p>
        </div>
      </div>

      <Card>
        {items.length === 0 ? (
          <Empty title="Belum ada file arsip" desc="Modul ini hanya untuk menyimpan file lama; situs publik tidak lagi menampilkan unduhan." />
        ) : (
          <TableWrap>
            <thead>
              <tr className="border-b border-brand-900/8">
                <Th>File</Th>
                <Th>Jenis</Th>
                <Th>Unduhan</Th>
                <Th>Leads</Th>
                <Th>Status</Th>
                <Th className="text-right">Aksi</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-900/[0.05]">
              {items.map((d) => {
                const ext = d.file_path.split(".").pop()?.toUpperCase() || "FILE";
                return (
                  <tr key={d.id} className="hover:bg-brand-50/40">
                    <Td>
                      <div className="flex items-center gap-2.5">
                        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                          <DownloadIcon width={15} height={15} />
                        </span>
                        <div className="min-w-0 max-w-[320px]">
                          <p className="truncate font-semibold text-brand-900">{d.title}</p>
                          <p className="truncate text-[9.5px] text-brand-900/35">{d.description || d.file_path}</p>
                        </div>
                      </div>
                    </Td>
                    <Td><span className="rounded bg-brand-50 px-1.5 py-0.5 text-[9px] font-bold text-brand-700">{ext}</span></Td>
                    <Td><span className="num font-semibold text-brand-900">{Number(d.download_count).toLocaleString("id-ID")}</span></Td>
                    <Td><span className="num text-brand-900/60">{Number(d.leads_count).toLocaleString("id-ID")}</span></Td>
                    <Td><StatusBadge active={Boolean(d.is_active)} /></Td>
                    <Td>
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/cms/download/${d.id}`} className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-brand-900/10 text-brand-900/45 transition hover:border-brand-700/30 hover:text-brand-800" title="Edit">
                          <Pencil width={13} height={13} />
                        </Link>
                        <form action={deleteDownload}>
                          <input type="hidden" name="id" value={d.id} />
                          <ConfirmSubmit />
                        </form>
                      </div>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </TableWrap>
        )}
      </Card>
    </>
  );
}
