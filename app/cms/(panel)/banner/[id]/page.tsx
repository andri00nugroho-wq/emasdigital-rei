import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "@/components/icons";
import { BannerForm } from "@/components/cms/banner-form";
import { PageHead } from "@/components/cms/ui";
import { queryOne } from "@/lib/db";
import type { Banner } from "@/lib/types";

export const metadata = { title: "Edit Banner — CMS" };

export default async function EditBannerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const banner = await queryOne<Banner>("SELECT * FROM banners WHERE id = ? LIMIT 1", [Number(id)]);
  if (!banner) notFound();

  return (
    <>
      <PageHead
        title="Edit banner"
        description={banner.title}
        actions={<Link href="/cms/banner" className="btn btn-md btn-outline"><ChevronLeft width={14} height={14} /> Kembali</Link>}
      />
      <BannerForm banner={banner} />
    </>
  );
}
