import Link from "next/link";
import { Pencil, Plus, Search } from "@/components/icons";
import { ConfirmSubmit } from "@/components/cms/confirm";
import { Card, Empty, Flash, PageHead, StatusBadge, TableWrap, Td, Th } from "@/components/cms/ui";
import { deleteProduct, toggleProduct } from "@/lib/actions/admin";
import { query } from "@/lib/db";
import { money } from "@/lib/format";

export const metadata = { title: "Produk — CMS" };

const labels: Record<string, string> = { digital: "Emas Digital", fisik: "Emas Fisik", gift: "Emas Gift" };

export default async function CmsProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string; error?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const q = (sp.q || "").trim();
  const products = await query<{
    id: number; name: string; slug: string; category: string; weight_gram: string; price: number; buyback_price: number;
    image: string | null; is_active: number; is_featured: number; sort_order: number;
  }>(
    `SELECT id, name, slug, category, weight_gram, price, buyback_price, image, is_active, is_featured, sort_order
     FROM products ${q ? "WHERE name LIKE ? OR slug LIKE ?" : ""} ORDER BY sort_order ASC, id ASC`,
    q ? [`%${q}%`, `%${q}%`] : []
  );

  return (
    <>
      <PageHead
        title="Produk"
        description="Kelola katalog emas digital, fisik, dan gift. Perubahan langsung tampil di situs."
        actions={<Link href="/cms/produk/baru" className="btn btn-md btn-primary"><Plus width={15} height={15} /> Tambah produk</Link>}
      />
      <Flash saved={sp.saved} deleted={sp.deleted} error={sp.error} />

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-900/8 px-4 py-3">
          <form className="relative w-full sm:w-72">
            <Search width={14} height={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-900/30" />
            <input name="q" defaultValue={q} placeholder="Cari produk…" className="field h-9 pl-9 text-[11.5px]" />
          </form>
          <p className="text-[10.5px] text-brand-900/40">{products.length} produk</p>
        </div>

        {products.length === 0 ? (
          <Empty title="Belum ada produk" desc="Tambahkan produk pertama untuk mulai mengisi katalog." />
        ) : (
          <TableWrap>
            <thead>
              <tr className="border-b border-brand-900/8">
                <Th>Produk</Th>
                <Th>Kategori</Th>
                <Th>Berat</Th>
                <Th>Harga</Th>
                <Th>Buyback</Th>
                <Th>Status</Th>
                <Th className="text-right">Aksi</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-900/[0.05]">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-brand-50/40">
                  <Td>
                    <div className="flex items-center gap-2.5">
                      <span className="h-9 w-12 shrink-0 overflow-hidden rounded-lg bg-brand-50">
                        {p.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.image} alt="" className="h-full w-full object-cover" />
                        ) : null}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-brand-900">{p.name}</p>
                        <p className="truncate text-[9.5px] text-brand-900/35">/{p.slug}</p>
                      </div>
                      {Boolean(p.is_featured) && <span className="rounded bg-gold-100 px-1.5 py-0.5 text-[8px] font-bold uppercase text-gold-800">Home</span>}
                    </div>
                  </Td>
                  <Td><span className="text-brand-900/60">{labels[p.category] || p.category}</span></Td>
                  <Td><span className="num text-brand-900/60">{Number(p.weight_gram).toLocaleString("id-ID")} g</span></Td>
                  <Td><span className="num font-semibold text-brand-900">{money(p.price)}</span></Td>
                  <Td><span className="num text-brand-900/60">{money(p.buyback_price)}</span></Td>
                  <Td>
                    <form action={toggleProduct}>
                      <input type="hidden" name="id" value={p.id} />
                      <button type="submit" title="Klik untuk mengubah status"><StatusBadge active={Boolean(p.is_active)} /></button>
                    </form>
                  </Td>
                  <Td>
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/cms/produk/${p.id}`} className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-brand-900/10 text-brand-900/45 transition hover:border-brand-700/30 hover:text-brand-800" title="Edit">
                        <Pencil width={13} height={13} />
                      </Link>
                      <form action={deleteProduct}>
                        <input type="hidden" name="id" value={p.id} />
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
          Gunakan urutan tampil untuk mengatur posisi produk pada halaman katalog.
        </div>
      </Card>
    </>
  );
}
