import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Aplikasi Raja Emas",
  robots: { index: false, follow: false },
};

export default function DownloadPage() {
  redirect("/aplikasi");
}
