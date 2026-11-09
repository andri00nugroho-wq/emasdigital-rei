import { getSettings } from "@/lib/settings";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { MobileAppBar } from "@/components/site/mobile-app-bar";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  return (
    <>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <MobileAppBar appName={s.app_name || "Raja Emas"} />
    </>
  );
}
