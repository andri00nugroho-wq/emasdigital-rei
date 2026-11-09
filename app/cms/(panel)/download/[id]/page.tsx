import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "@/components/icons";
import { DownloadForm } from "@/components/cms/download-form";
import { PageHead } from "@/components/cms/ui";
import { queryOne } from "@/lib/db";
import type { DownloadItem } from "@/lib/types";

export const metadata = { title: "Edit File Arsip — CMS" };

export default async function EditDownloadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await queryOne<DownloadItem & { leads_count: number }>(
    `SELECT d.*, (SELECT COUNT(*) FROM leads l WHERE l.download_id = d.id) AS leads_count
     FROM downloads d WHERE d.id = ? LIMIT 1`,
    [Number(id)]
  );
  if (!item) notFound();

  return (
    <>
      <PageHead
        title="Edit file arsip"
        description={item.title}
        actions={<Link href="/cms/download" className="btn btn-md btn-outline"><ChevronLeft width={14} height={14} /> Kembali</Link>}
      />
      <DownloadForm item={item} />
    </>
  );
}
