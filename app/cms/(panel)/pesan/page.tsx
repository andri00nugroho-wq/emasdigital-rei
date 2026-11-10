import Link from "next/link";
import { Inbox, Mail, Phone } from "@/components/icons";
import { ConfirmSubmit } from "@/components/cms/confirm";
import { Card, Empty, Flash, PageHead, StatusBadge } from "@/components/cms/ui";
import { deleteMessage, toggleMessage } from "@/lib/actions/admin";
import { query } from "@/lib/db";
import { formatDate, timeAgo } from "@/lib/format";
import type { ContactMessage } from "@/lib/types";

export const metadata = { title: "Pesan Masuk — CMS" };

export default async function CmsMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; saved?: string; deleted?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const filter = sp.filter === "unread" ? "unread" : sp.filter === "read" ? "read" : "";

  const [messages, unreadRows] = await Promise.all([
    query<ContactMessage>(
      `SELECT * FROM contact_messages ${filter === "unread" ? "WHERE is_read = FALSE" : filter === "read" ? "WHERE is_read = TRUE" : ""}
       ORDER BY is_read ASC, created_at DESC LIMIT 200`
    ),
    query<{ n: number }>("SELECT COUNT(*) AS n FROM contact_messages WHERE is_read = FALSE"),
  ]);
  const unread = Number(unreadRows[0]?.n ?? 0);

  const tabs = [
    { key: "", label: "Semua" },
    { key: "unread", label: "Belum dibaca" },
    { key: "read", label: "Sudah dibaca" },
  ];

  return (
    <>
      <PageHead
        title="Pesan Masuk"
        description="Pesan dari formulir kontak. Balas melalui email atau WhatsApp yang tercantum."
        actions={<span className="rounded-full bg-gold-50 px-3 py-1.5 text-[11px] font-semibold text-gold-800">{unread} belum dibaca</span>}
      />
      <Flash saved={sp.saved} deleted={sp.deleted} error={sp.error} />

      <div className="mb-4 flex gap-1 rounded-xl border border-brand-900/8 bg-white p-1">
        {tabs.map((t) => (
          <Link
            key={t.key}
            href={t.key ? `/cms/pesan?filter=${t.key}` : "/cms/pesan"}
            className={`rounded-lg px-3 py-1.5 text-[11.5px] font-semibold transition ${
              filter === t.key ? "bg-brand-900 text-white" : "text-brand-900/50 hover:bg-brand-50"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {messages.length === 0 ? (
        <Card><Empty title="Tidak ada pesan" desc="Pesan baru dari formulir kontak akan muncul di sini." /></Card>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <Card key={m.id} className={m.is_read ? "" : "border-gold-500/40 ring-1 ring-gold-500/10"}>
              <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[13px] font-bold text-brand-900">{m.name}</p>
                    <StatusBadge active={!m.is_read} labels={["Belum dibaca", "Sudah dibaca"]} />
                    <span className="text-[10px] text-brand-900/35">{timeAgo(m.created_at)}</span>
                  </div>
                  <p className="mt-0.5 text-[11px] font-semibold text-brand-700">{m.subject || "Tanpa subjek"}</p>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[10.5px] text-brand-900/50">
                    <a href={`mailto:${m.email}`} className="inline-flex items-center gap-1 hover:text-brand-800"><Mail width={11} height={11} /> {m.email}</a>
                    {m.phone && <a href={`https://wa.me/${m.phone.replace(/^0/, "62").replace(/[^\d]/g, "")}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-brand-800"><Phone width={11} height={11} /> {m.phone}</a>}
                    <span>{formatDate(m.created_at)}</span>
                  </div>

                  <details className="group mt-3">
                    <summary className="inline-flex cursor-pointer list-none items-center gap-1 text-[11px] font-semibold text-brand-700">
                      Lihat pesan
                      <span className="transition group-open:rotate-180">▾</span>
                    </summary>
                    <p className="mt-2 whitespace-pre-line rounded-xl bg-brand-50/60 p-3 text-[11.5px] leading-relaxed text-brand-900/75">{m.message}</p>
                  </details>
                </div>

                <div className="flex shrink-0 items-center gap-1.5">
                  <form action={toggleMessage}>
                    <input type="hidden" name="id" value={m.id} />
                    <button type="submit" className="rounded-lg border border-brand-900/10 px-2.5 py-1.5 text-[10.5px] font-semibold text-brand-700 transition hover:border-brand-700/30 hover:bg-brand-50">
                      {m.is_read ? "Tandai belum dibaca" : "Tandai dibaca"}
                    </button>
                  </form>
                  <form action={deleteMessage}>
                    <input type="hidden" name="id" value={m.id} />
                    <ConfirmSubmit />
                  </form>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <p className="mt-4 flex items-center gap-1.5 text-[10px] text-brand-900/35">
        <Inbox width={12} height={12} /> Menampilkan maksimal 200 pesan terbaru.
      </p>
    </>
  );
}
