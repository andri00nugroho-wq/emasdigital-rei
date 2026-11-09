import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Eye } from "@/components/icons";
import { ArticleForm } from "@/components/cms/article-form";
import { PageHead } from "@/components/cms/ui";
import { queryOne } from "@/lib/db";
import type { Article } from "@/lib/types";

export const metadata = { title: "Edit Artikel — CMS" };

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await queryOne<Article>("SELECT * FROM articles WHERE id = ? LIMIT 1", [Number(id)]);
  if (!article) notFound();

  return (
    <>
      <PageHead
        title="Edit artikel"
        description={article.title}
        actions={
          <div className="flex items-center gap-2">
            {article.status === "published" && (
              <Link href={`/artikel/${article.slug}`} target="_blank" className="btn btn-md btn-outline">
                <Eye width={14} height={14} /> Lihat
              </Link>
            )}
            <Link href="/cms/artikel" className="btn btn-md btn-outline"><ChevronLeft width={14} height={14} /> Kembali</Link>
          </div>
        }
      />
      <ArticleForm article={article} />
    </>
  );
}
