import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";

const RANGES: Record<string, number> = { "7": 7, "30": 30, "90": 90 };

function cell(value: unknown): string {
  const s = value == null ? "" : String(value);
  return /[",\n\r;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.redirect(new URL("/cms/login", request.url));
  }

  const url = new URL(request.url);
  const q = (url.searchParams.get("q") || "").trim();
  const downloadId = Number(url.searchParams.get("download")) || 0;
  const rangeParam = url.searchParams.get("range") || "";
  const range = RANGES[rangeParam] ? rangeParam : "";

  const where: string[] = [];
  const params: (string | number)[] = [];
  if (q) {
    where.push("(l.name ILIKE ? OR l.phone ILIKE ? OR l.email ILIKE ?)");
    params.push(`%${q}%`, `%${q}%`, `%${q}%`);
  }
  if (downloadId) {
    where.push("l.download_id = ?");
    params.push(downloadId);
  }
  if (range) {
    where.push("l.created_at >= NOW() - (?::int * INTERVAL '1 day')");
    params.push(RANGES[range]);
  }

  const rows = await query<{
    id: number;
    name: string;
    phone: string;
    email: string | null;
    download_title: string | null;
    source: string;
    created_at: string;
  }>(
    `SELECT l.id, l.name, l.phone, l.email, l.source, l.created_at, d.title AS download_title
     FROM leads l LEFT JOIN downloads d ON d.id = l.download_id
     ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
     ORDER BY l.created_at DESC, l.id DESC`,
    params
  );

  const header = ["ID", "Nama", "WhatsApp", "Email", "File", "Sumber", "Tanggal"];
  const lines = [header.join(",")];
  for (const r of rows) {
    lines.push(
      [r.id, r.name, r.phone, r.email, r.download_title, r.source, r.created_at].map(cell).join(",")
    );
  }

  const stamp = new Date().toISOString().slice(0, 10);
  return new NextResponse(`\uFEFF${lines.join("\r\n")}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-rei-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
