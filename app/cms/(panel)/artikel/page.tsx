import Link from "next/link";
import { Eye, Pencil, Plus, Search } from "@/components/icons";
import { ConfirmSubmit } from "@/components/cms/confirm";
import { Card, Empty, Flash, PageHead, StatusBadge, TableWrap, Td, Th } from "@/components/cms/ui";
import { deleteArticle, toggleArticle } from "@/lib/actions/admin";
import { query } from "@/lib/db";
import { formatDate } from "@/lib/format";
import type { Article } from "@/lib/types";

export const metadata = { title: "Artikel — CMS" };

export default async function CmsArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string; error?: string; q?: string; status?: string }>;
}) {
  const sp = await searchParams;
  const q = (sp.q || "").trim();
  const status = sp.status === "draft" || sp.status === "published" ? sp.status : "";
  const where: string[] = [];
  const params: (string | number)[] = [];
  if (q) {
    where.push("(title ILIKE ? OR author ILIKE ? OR category ILIKE ?)");
    params.push(`%${q}%`, `%${q}%`, `%${q}%`);
  }
  if (status) {
    where.push("status = ?");
    params.push(status);
  }

  const articles = await query<Article>(
    `SELECT id, slug, title, excerpt, cover, category, author, status, views, published_at, created_at
     FROM articles ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
     ORDER BY published_at DESC, id DESC`,
    params
  );

  return (
    <>
      <PageHead
        title="Artikel"
        description="Kelola konten edukasi dan berita seputar emas digital."
        actions={<Link href="/cms/artikel/baru" className="btn btn-md btn-primary"><Plus width={15} height={15} /> Tulis artikel</Link>}
      />
      <Flash saved={sp.saved} deleted={sp.deleted} error={sp.error} />

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-900/8 px-4 py-3">
          <form className="flex w-full flex-wrap gap-2 sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search width={14} height={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-900/30" />
              <input name="q" defaultValue={q} placeholder="Cari judul, penulis…" className="field h-9 pl-9 text-[11.5px]" />
            </div>
            <select name="status" defaultValue={status} className="field h-9 w-auto text-[11.5px]">
              <option value="">Semua status</option>
              <option value="published">Terbit</option>
              <option value="draft">Draf</option>
            </select>
            <button type="submit" className="btn btn-md btn-outline">Filter</button>
          </form>
          <p className="text-[10.5px] text-brand-900/40">{articles.length} artikel</p>
        </div>

        {articles.length === 0 ? (
          <Empty title="Belum ada artikel" desc="Tulis artikel pertama untuk menarik pengunjung melalui pencarian." />
        ) : (
          <TableWrap>
            <thead>
              <tr className="border-b border-brand-900/8">
                <Th>Artikel</Th>
                <Th>Kategori</Th>
                <Th>Penulis</Th>
                <Th>Dibaca</Th>
                <Th>Status</Th>
                <Th>Terbit</Th>
                <Th className="text-right">Aksi</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-900/[0.05]">
              {articles.map((a) => (
                <tr key={a.id} className="hover:bg-brand-50/40">
                  <Td>
                    <div className="flex items-center gap-2.5">
                      <span className="h-10 w-14 shrink-0 overflow-hidden rounded-lg bg-brand-50">
                        {a.cover ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={a.cover} alt="" className="h-full w-full object-cover" />
                        ) : null}
                      </span>
                      <div className="min-w-0 max-w-[280px]">
                        <p className="truncate font-semibold text-brand-900">{a.title}</p>
                        <p className="truncate text-[9.5px] text-brand-900/35">/artikel/{a.slug}</p>
                      </div>
                    </div>
                  </Td>
                  <Td><span className="text-brand-900/60">{a.category}</span></Td>
                  <Td><span className="text-brand-900/60">{a.author}</span></Td>
                  <Td><span className="num text-brand-900/60">{a.views.toLocaleString("id-ID")}</span></Td>
                  <Td>
                    <form action={toggleArticle}>
                      <input type="hidden" name="id" value={a.id} />
                      <button type="submit" title="Klik untuk mengubah status">
                        <StatusBadge active={a.status === "published"} labels={["Terbit", "Draf"]} />
                      </button>
                    </form>
                  </Td>
                  <Td><span className="whitespace-nowrap text-brand-900/50">{formatDate(a.published_at)}</span></Td>
                  <Td>
                    <div className="flex items-center justify-end gap-1">
                      {a.status === "published" && (
                        <Link href={`/artikel/${a.slug}`} target="_blank" className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-brand-900/10 text-brand-900/45 transition hover:border-brand-700/30 hover:text-brand-800" title="Lihat artikel">
                          <Eye width={13} height={13} />
                        </Link>
                      )}
                      <Link href={`/cms/artikel/${a.id}`} className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-brand-900/10 text-brand-900/45 transition hover:border-brand-700/30 hover:text-brand-800" title="Edit">
                        <Pencil width={13} height={13} />
                      </Link>
                      <form action={deleteArticle}>
                        <input type="hidden" name="id" value={a.id} />
                        <ConfirmSubmit />
                      </form>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        )}
      </Card>
    </>
  );
}
