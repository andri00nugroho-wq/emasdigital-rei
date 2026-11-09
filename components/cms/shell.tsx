"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Close,
  Dashboard,
  DownloadIcon,
  External,
  FileText,
  ImageIcon,
  Inbox,
  LogOut,
  Menu,
  Package,
  SettingsIcon,
  Tag,
  Users,
  Message,
  Book,
} from "@/components/icons";
import { logout } from "@/lib/actions/admin";

type NavItem = { href: string; label: string; icon: React.ComponentType<{ width?: number; height?: number; className?: string }>; exact?: boolean; badge?: number };

const sections: { title: string; items: NavItem[] }[] = [
  { title: "Utama", items: [{ href: "/cms", label: "Dashboard", icon: Dashboard, exact: true }] },
  {
    title: "Katalog",
    items: [
      { href: "/cms/produk", label: "Produk", icon: Package },
      { href: "/cms/harga", label: "Harga Emas", icon: Tag },
    ],
  },
  {
    title: "Konten",
    items: [
      { href: "/cms/artikel", label: "Artikel", icon: FileText },
      { href: "/cms/banner", label: "Banner Hero", icon: ImageIcon },
      { href: "/cms/download", label: "Arsip Panduan", icon: DownloadIcon },
      { href: "/cms/faq", label: "FAQ", icon: Book },
    ],
  },
  {
    title: "Interaksi",
    items: [
      { href: "/cms/leads", label: "Leads Lama", icon: Users },
      { href: "/cms/pesan", label: "Pesan Masuk", icon: Inbox },
    ],
  },
  { title: "Sistem", items: [{ href: "/cms/pengaturan", label: "Pengaturan Situs", icon: SettingsIcon }] },
];

export function CmsShell({
  user,
  unread,
  children,
}: {
  user: { name: string; email: string; role: string };
  unread: number;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const slug = pathname.split("/")[2];
  const titles: Record<string, string> = {
    download: "Arsip Panduan",
    leads: "Leads Lama",
    pengaturan: "Pengaturan Situs",
  };
  const title =
    pathname === "/cms"
      ? "Dashboard"
      : (slug && titles[slug]) || slug?.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "CMS";

  return (
    <div className="min-h-screen bg-cream-100">
      {/* sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[252px] flex-col bg-brand-950 text-white transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/8 px-5">
          <Link href="/cms" onClick={() => setOpen(false)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-rei.png" alt="Raja Emas Indonesia" className="h-8 w-auto" />
          </Link>
          <button type="button" onClick={() => setOpen(false)} className="text-white/50 lg:hidden" aria-label="Tutup menu">
            <Close width={18} height={18} />
          </button>
        </div>

        <div className="flex items-center justify-between px-5 pt-5 pb-2">
          <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-gold-500/70">Content Management</span>
          <span className="rounded bg-gold-500/15 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-gold-300">v1.0</span>
        </div>

        <nav className="flex-1 space-y-5 overflow-y-auto px-3 pb-6 scrollbar-thin">
          {sections.map((sec) => (
            <div key={sec.title}>
              <p className="px-2.5 pb-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-white/25">{sec.title}</p>
              <div className="space-y-0.5">
                {sec.items.map((item) => {
                  const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                  const badge = item.href === "/cms/pesan" ? unread : 0;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`group flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[12.5px] font-medium transition ${
                        active ? "bg-gold-500 text-brand-950 shadow-[0_8px_20px_-10px_rgba(212,175,55,0.8)]" : "text-white/60 hover:bg-white/[0.06] hover:text-white"
                      }`}
                    >
                      <item.icon width={16} height={16} className={active ? "text-brand-900" : "text-white/40 group-hover:text-gold-300"} />
                      <span className="flex-1">{item.label}</span>
                      {badge > 0 && (
                        <span className={`inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold ${active ? "bg-brand-950 text-gold-300" : "bg-gold-500 text-brand-950"}`}>
                          {badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/8 p-3">
          <div className="flex items-center gap-2.5 rounded-xl bg-white/[0.05] p-2.5">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-500 text-[11px] font-bold text-brand-950">
              {user.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[11.5px] font-semibold text-white">{user.name}</p>
              <p className="truncate text-[9.5px] text-white/35">{user.role === "superadmin" ? "Super Admin" : "Editor"}</p>
            </div>
            <form action={logout}>
              <button type="submit" className="text-white/40 transition hover:text-rose-300" title="Keluar" aria-label="Keluar">
                <LogOut width={15} height={15} />
              </button>
            </form>
          </div>
        </div>
      </aside>

      {open && <div className="fixed inset-0 z-40 bg-brand-950/60 backdrop-blur-sm lg:hidden" onClick={() => setOpen(false)} />}

      {/* main */}
      <div className="lg:pl-[252px]">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-brand-900/8 bg-cream-50/90 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-brand-900/10 bg-white text-brand-800 lg:hidden"
              aria-label="Buka menu"
            >
              <Menu width={17} height={17} />
            </button>
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-brand-900/35">CMS Raja Emas</p>
              <p className="text-[13.5px] font-bold leading-tight text-brand-900">{title}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" target="_blank" className="hidden items-center gap-1.5 rounded-full border border-brand-900/10 bg-white px-3 py-1.5 text-[11px] font-semibold text-brand-700 transition hover:border-brand-700/30 sm:inline-flex">
              Lihat situs <External width={12} height={12} />
            </Link>
            <div className="hidden h-6 w-px bg-brand-900/10 sm:block" />
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-900 text-[10px] font-bold text-gold-300">
                {user.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </span>
              <div className="hidden sm:block">
                <p className="max-w-[130px] truncate text-[11px] font-semibold text-brand-900">{user.name}</p>
                <p className="text-[9px] text-brand-900/40">{user.email}</p>
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1420px] p-4 sm:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}

export function UnusedMessageIcon() {
  return <Message width={16} height={16} />;
}
