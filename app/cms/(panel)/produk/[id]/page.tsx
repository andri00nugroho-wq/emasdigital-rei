import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, External } from "@/components/icons";
import { ProductForm } from "@/components/cms/product-form";
import { PageHead } from "@/components/cms/ui";
import { queryOne } from "@/lib/db";
import type { Product } from "@/lib/types";

export const metadata = { title: "Edit Produk — CMS" };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = await queryOne<Product & { features: unknown }>("SELECT * FROM products WHERE id = ? LIMIT 1", [Number(id)]);
  if (!row) notFound();

  let features: string[] = [];
  try {
    const parsed = typeof row.features === "string" ? JSON.parse(row.features) : row.features;
    features = Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    features = [];
  }

  const product = { ...row, features };

  return (
    <>
      <PageHead
        title={`Edit: ${product.name}`}
        description="Perbarui informasi produk. Perubahan langsung terlihat di situs publik."
        actions={
          <>
            <Link href={`/produk/${product.slug}`} target="_blank" className="btn btn-md btn-outline"><External width={14} height={14} /> Lihat halaman</Link>
            <Link href="/cms/produk" className="btn btn-md btn-outline"><ChevronLeft width={14} height={14} /> Kembali</Link>
          </>
        }
      />
      <ProductForm product={product} />
    </>
  );
}
