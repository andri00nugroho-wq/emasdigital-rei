import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { queryOne } from "@/lib/db";
import { CmsShell } from "@/components/cms/shell";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession();
  if (!user) redirect("/cms/login");

  const unread = await queryOne<{ c: number }>("SELECT COUNT(*) AS c FROM contact_messages WHERE is_read = 0");

  return (
    <CmsShell user={user} unread={Number(unread?.c || 0)}>
      {children}
    </CmsShell>
  );
}
