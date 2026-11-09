import Link from "next/link";
import { Pencil, Plus } from "@/components/icons";
import { ConfirmSubmit } from "@/components/cms/confirm";
import { Card, Empty, Flash, PageHead, StatusBadge, TableWrap, Td, Th } from "@/components/cms/ui";
import { deleteBanner, toggleBanner } from "@/lib/actions/admin";
import { query } from "@/lib/db";
import type { Banner } from "@/lib/types";

export const metadata = { title: "Banner — CMS" };

export default async function CmsBannersPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const banners = await query<Banner>("SELECT * FROM banners ORDER BY sort_order ASC, id ASC");

  return (
    <>
      <PageHead
        title="Banner Hero"
        description="Atur tampilan bagian utama beranda. Banner aktif dengan urutan terkecil akan ditampilkan."
        actions={<Link href="/cms/banner/baru" className="btn btn-md btn-primary"><Plus width={15} height={15} /> Tambah banner</Link>}
      />
      <Flash saved={sp.saved} deleted={sp.deleted} error={sp.error} />

      <Card>
        {banners.length === 0 ? (
          <Empty title="Belum ada banner" desc="Tambahkan banner hero untuk mengatur pesan utama di beranda." />
        ) : (
          <TableWrap>
            <thead>
              <tr className="border-b border-brand-900/8">
                <Th>Banner</Th>
                <Th>Kicker</Th>
                <Th>CTA</Th>
                <Th>Urutan</Th>
                <Th>Status</Th>
                <Th className="text-right">Aksi</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-900/[0.05]">
              {banners.map((b) => (
                <tr key={b.id} className="hover:bg-brand-50/40">
                  <Td>
                    <div className="flex items-center gap-2.5">
                      <span className="h-10 w-14 shrink-0 overflow-hidden rounded-lg bg-brand-50">
                        {b.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={b.image} alt="" className="h-full w-full object-cover" />
                        ) : null}
                      </span>
                      <div className="min-w-0 max-w-[320px]">
                        <p className="truncate font-semibold text-brand-900">{b.title}</p>
                        <p className="truncate text-[9.5px] text-brand-900/35">{b.subtitle || "Tanpa subjudul"}</p>
                      </div>
                    </div>
                  </Td>
                  <Td><span className="text-brand-900/60">{b.kicker || "—"}</span></Td>
                  <Td><span className="text-brand-900/60">{b.cta_label || "—"}</span></Td>
                  <Td><span className="num text-brand-900/60">{b.sort_order}</span></Td>
                  <Td>
                    <form action={toggleBanner}>
                      <input type="hidden" name="id" value={b.id} />
                      <button type="submit" title="Klik untuk mengubah status"><StatusBadge active={Boolean(b.is_active)} /></button>
                    </form>
                  </Td>
                  <Td>
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/cms/banner/${b.id}`} className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-brand-900/10 text-brand-900/45 transition hover:border-brand-700/30 hover:text-brand-800" title="Edit">
                        <Pencil width={13} height={13} />
                      </Link>
                      <form action={deleteBanner}>
                        <input type="hidden" name="id" value={b.id} />
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
