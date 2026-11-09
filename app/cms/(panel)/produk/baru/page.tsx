import Link from "next/link";
import { ChevronLeft } from "@/components/icons";
import { ProductForm } from "@/components/cms/product-form";
import { PageHead } from "@/components/cms/ui";

export const metadata = { title: "Tambah Produk — CMS" };

export default function NewProductPage() {
  return (
    <>
      <PageHead
        title="Tambah produk"
        description="Isi informasi produk baru. Slug akan dibuat otomatis dari nama."
        actions={<Link href="/cms/produk" className="btn btn-md btn-outline"><ChevronLeft width={14} height={14} /> Kembali</Link>}
      />
      <ProductForm />
    </>
  );
}
