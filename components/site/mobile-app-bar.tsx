"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Apple, PlayStore, Smartphone } from "@/components/icons";

export function MobileAppBar({ appName = "Raja Emas" }: { appName?: string }) {
  const pathname = usePathname();
  if (pathname === "/aplikasi") return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-900/10 bg-cream-50/95 backdrop-blur-xl lg:hidden">
      <div className="container-rei flex items-center justify-between gap-3 py-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))]">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-900 text-gold-300">
            <Smartphone width={17} height={17} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[11.5px] font-bold text-brand-900">Aplikasi {appName}</p>
            <p className="flex items-center gap-1.5 text-[9.5px] text-brand-900/45">
              <PlayStore width={10} height={10} /> <Apple width={9} height={9} /> Gratis di Play Store &amp; App Store
            </p>
          </div>
        </div>
        <Link href="/aplikasi" className="btn h-9 shrink-0 bg-brand-900 px-4 text-[11.5px] font-semibold text-white hover:bg-brand-800">
          Unduh
        </Link>
      </div>
    </div>
  );
}
