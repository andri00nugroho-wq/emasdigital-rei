import Link from "next/link";
import { ChevronLeft } from "@/components/icons";
import { ArticleForm } from "@/components/cms/article-form";
import { PageHead } from "@/components/cms/ui";

export const metadata = { title: "Tulis Artikel — CMS" };

export default function NewArticlePage() {
  return (
    <>
      <PageHead
        title="Tulis artikel"
        description="Bagikan edukasi seputar emas digital. Artikel terbit langsung muncul di halaman Artikel."
        actions={<Link href="/cms/artikel" className="btn btn-md btn-outline"><ChevronLeft width={14} height={14} /> Kembali</Link>}
      />
      <ArticleForm />
    </>
  );
}
