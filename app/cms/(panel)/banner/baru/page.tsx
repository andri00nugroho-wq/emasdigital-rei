import Link from "next/link";
import { ChevronLeft } from "@/components/icons";
import { BannerForm } from "@/components/cms/banner-form";
import { PageHead } from "@/components/cms/ui";

export const metadata = { title: "Tambah Banner — CMS" };

export default function NewBannerPage() {
  return (
    <>
      <PageHead
        title="Tambah banner"
        description="Banner hero mengatur pesan utama pada halaman beranda."
        actions={<Link href="/cms/banner" className="btn btn-md btn-outline"><ChevronLeft width={14} height={14} /> Kembali</Link>}
      />
      <BannerForm />
    </>
  );
}
