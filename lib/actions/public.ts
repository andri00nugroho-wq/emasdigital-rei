"use server";

import { execute, queryOne } from "@/lib/db";
import { revalidatePath } from "next/cache";

export type LeadState = {
  status: "idle" | "success" | "error";
  message?: string;
  file?: string;
  title?: string;
};

const phoneOk = (v: string) => /^(\+?62|0)8[1-9][0-9]{7,11}$/.test(v.replace(/[\s-]/g, ""));

export async function submitLead(_prev: LeadState, formData: FormData): Promise<LeadState> {
  const name = String(formData.get("name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const downloadId = Number(formData.get("download_id") || 0);
  const source = String(formData.get("source") || "panduan");

  if (name.length < 2) return { status: "error", message: "Mohon isi nama lengkap Anda." };
  if (!phoneOk(phone)) return { status: "error", message: "Nomor WhatsApp tidak valid. Contoh: 081234567890." };
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: "error", message: "Alamat email tidak valid." };
  }

  const download = downloadId
    ? await queryOne<{ id: number; title: string; file_path: string }>(
        "SELECT id, title, file_path FROM downloads WHERE id = ? AND is_active = 1",
        [downloadId]
      )
    : null;

  await execute(
    "INSERT INTO leads (name, phone, email, download_id, source) VALUES (?,?,?,?,?)",
    [name, phone, email || null, download?.id ?? null, source]
  );
  if (download) {
    await execute("UPDATE downloads SET download_count = download_count + 1 WHERE id = ?", [download.id]);
  }

  revalidatePath("/cms");
  revalidatePath("/cms/leads");

  return {
    status: "success",
    message: "Terima kasih! Panduan Anda siap diunduh.",
    file: download?.file_path,
    title: download?.title,
  };
}

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const subject = String(formData.get("subject") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (name.length < 2) return { status: "error", message: "Mohon isi nama Anda." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { status: "error", message: "Alamat email tidak valid." };
  if (message.length < 10) return { status: "error", message: "Pesan terlalu singkat. Mohon jelaskan kebutuhan Anda." };

  await execute(
    "INSERT INTO contact_messages (name, email, phone, subject, message) VALUES (?,?,?,?,?)",
    [name, email, phone || null, subject || null, message]
  );

  revalidatePath("/cms/pesan");
  return { status: "success", message: "Pesan Anda sudah kami terima. Tim kami akan menghubungi Anda dalam 1×24 jam kerja." };
}
