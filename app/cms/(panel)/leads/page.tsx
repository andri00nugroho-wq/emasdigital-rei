import Link from "next/link";
import { DownloadIcon, Search, Users } from "@/components/icons";
import { ConfirmSubmit } from "@/components/cms/confirm";
import { Card, Empty, Flash, PageHead, StatCard, TableWrap, Td, Th } from "@/components/cms/ui";
import { deleteLead } from "@/lib/actions/admin";
import { query } from "@/lib/db";
import { formatDate, timeAgo } from "@/lib/format";
import type { DownloadItem, Lead } from "@/lib/types";

export const metadata = { title: "Leads Lama — CMS" };

const RANGES: Record<string, number> = { "7": 7, "30": 30, "90": 90 };

export default async function CmsLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; download?: string; range?: string; saved?: string; deleted?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const q = (sp.q || "").trim();
  const downloadId = Number(sp.download) || 0;
  const range = RANGES[sp.range || ""] ? (sp.range as string) : "";

  const where: string[] = [];
  const params: (string | number)[] = [];
  if (q) {
    where.push("(l.name ILIKE ? OR l.phone ILIKE ? OR l.email ILIKE ?)");
    params.push(`%${q}%`, `%${q}%`, `%${q}%`);
  }
  if (downloadId) {
    where.push("l.download_id = ?");
    params.push(downloadId);
  }
  if (range) {
    where.push("l.created_at >= NOW() - (?::int * INTERVAL '1 day')");
    params.push(RANGES[range]);
  }

  const [leads, downloads, agg] = await Promise.all([
    query<Lead>(
      `SELECT l.id, l.name, l.phone, l.email, l.download_id, l.source, l.created_at, d.title AS download_title
       FROM leads l LEFT JOIN downloads d ON d.id = l.download_id
       ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
       ORDER BY l.created_at DESC, l.id DESC LIMIT 300`,
      params
    ),
    query<DownloadItem>("SELECT id, title, download_count FROM downloads ORDER BY id ASC"),
    query<{ total: number; today: number; week: number }>(
      `SELECT COUNT(*) AS total,
              COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE) AS today,
              COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') AS week
       FROM leads`
    ),
  ]);

  const totals = agg[0] || { total: 0, today: 0, week: 0 };
  const exportQuery = new URLSearchParams();
  if (q) exportQuery.set("q", q);
  if (downloadId) exportQuery.set("download", String(downloadId));
  if (range) exportQuery.set("range", range);

  return (
    <>
      <PageHead
        title="Leads Lama"
        description="Arsip leads dari formulir panduan yang sudah tidak dipakai. Funnel situs sekarang mengarah ke unduhan aplikasi."
        actions={
          <a href={`/cms/leads/export?${exportQuery.toString()}`} className="btn btn-md btn-outline">
            <DownloadIcon width={14} height={14} /> Ekspor CSV
          </a>
        }
      />
      <Flash saved={sp.saved} deleted={sp.deleted} error={sp.error} />

      <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-[11px] leading-relaxed text-amber-900/80">
        <strong>Data arsip.</strong> Formulir unduhan panduan sudah dihapus dari situs publik. Data di bawah dipertahankan untuk riwayat; leads baru masuk melalui halaman{" "}
        <Link href="/cms/pesan" className="font-semibold underline">Pesan Masuk</Link>.
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <StatCard label="Total leads" value={totals.total?.toLocaleString("id-ID") ?? "0"} icon={Users} tone="dark" hint="Sejak situs diluncurkan" />
        <StatCard label="7 hari terakhir" value={totals.week?.toLocaleString("id-ID") ?? "0"} icon={Users} hint="Leads baru minggu ini" />
        <StatCard label="Hari ini" value={totals.today?.toLocaleString("id-ID") ?? "0"} icon={Users} tone="gold" hint="Perbarui halaman untuk melihat data terbaru" />
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-900/8 px-4 py-3">
          <form className="flex w-full flex-wrap gap-2 sm:w-auto">
            <div className="relative w-full sm:w-56">
              <Search width={14} height={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-900/30" />
              <input name="q" defaultValue={q} placeholder="Cari nama, WhatsApp…" className="field h-9 pl-9 text-[11.5px]" />
            </div>
            <select name="download" defaultValue={downloadId ? String(downloadId) : ""} className="field h-9 w-auto max-w-[190px] text-[11.5px]">
              <option value="">Semua file</option>
              {downloads.map((d) => <option key={d.id} value={d.id}>{d.title}</option>)}
            </select>
            <select name="range" defaultValue={range} className="field h-9 w-auto text-[11.5px]">
              <option value="">Semua waktu</option>
              <option value="7">7 hari</option>
              <option value="30">30 hari</option>
              <option value="90">90 hari</option>
            </select>
            <button type="submit" className="btn btn-md btn-outline">Filter</button>
          </form>
          <p className="text-[10.5px] text-brand-900/40">{leads.length} baris ditampilkan</p>
        </div>

        {leads.length === 0 ? (
          <Empty title="Belum ada leads" desc="Data leads lama akan muncul di sini. Formulir panduan sudah tidak aktif di situs publik." />
        ) : (
          <TableWrap>
            <thead>
              <tr className="border-b border-brand-900/8">
                <Th>Nama</Th>
                <Th>WhatsApp</Th>
                <Th>Email</Th>
                <Th>File</Th>
                <Th>Sumber</Th>
                <Th>Waktu</Th>
                <Th className="text-right">Aksi</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-900/[0.05]">
              {leads.map((l) => (
                <tr key={l.id} className="hover:bg-brand-50/40">
                  <Td><span className="font-semibold text-brand-900">{l.name}</span></Td>
                  <Td>
                    <a href={`https://wa.me/${l.phone.replace(/^0/, "62").replace(/[^\d]/g, "")}`} target="_blank" rel="noreferrer" className="num text-brand-700 underline decoration-gold-400 underline-offset-2">
                      {l.phone}
                    </a>
                  </Td>
                  <Td><span className="text-brand-900/60">{l.email || "—"}</span></Td>
                  <Td><span className="text-brand-900/60">{l.download_title || "—"}</span></Td>
                  <Td><span className="rounded bg-brand-50 px-1.5 py-0.5 text-[9px] font-semibold text-brand-700">{l.source}</span></Td>
                  <Td>
                    <span className="block whitespace-nowrap text-brand-900/70">{timeAgo(l.created_at)}</span>
                    <span className="block whitespace-nowrap text-[9.5px] text-brand-900/35">{formatDate(l.created_at)}</span>
                  </Td>
                  <Td>
                    <div className="flex items-center justify-end">
                      <form action={deleteLead}>
                        <input type="hidden" name="id" value={l.id} />
                        <ConfirmSubmit />
                      </form>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        )}
        <div className="border-t border-brand-900/8 px-4 py-3 text-[10px] text-brand-900/35">
          Maksimal 300 baris terbaru ditampilkan. Gunakan Ekspor CSV untuk data lengkap.
        </div>
      </Card>
    </>
  );
}
