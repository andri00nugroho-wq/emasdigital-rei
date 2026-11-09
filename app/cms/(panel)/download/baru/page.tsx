import Link from "next/link";
import { ChevronLeft } from "@/components/icons";
import { DownloadForm } from "@/components/cms/download-form";
import { PageHead } from "@/components/cms/ui";

export const metadata = { title: "Tambah File Arsip — CMS" };

export default function NewDownloadPage() {
  return (
    <>
      <PageHead
        title="Tambah file arsip"
        description="Unggah file ke arsip panduan. File tersimpan untuk referensi internal dan tidak lagi tampil di situs publik."
        actions={<Link href="/cms/download" className="btn btn-md btn-outline"><ChevronLeft width={14} height={14} /> Kembali</Link>}
      />
      <DownloadForm />
    </>
  );
}
