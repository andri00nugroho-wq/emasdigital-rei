"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import fs from "node:fs/promises";
import path from "node:path";
import { execute, queryOne } from "@/lib/db";
import { createSession, destroySession, getSession } from "@/lib/auth";
import { slugify } from "@/lib/format";

async function requireUser() {
  const user = await getSession();
  if (!user) redirect("/cms/login");
  return user;
}

async function saveUpload(file: File | null, folder: string): Promise<string | null> {
  if (!file || !file.size) return null;
  if (file.size > 12 * 1024 * 1024) throw new Error("Ukuran file melebihi 12MB.");
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "application/pdf"];
  if (!allowed.includes(file.type)) throw new Error("Format file tidak didukung.");

  const ext = path.extname(file.name).toLowerCase() || (file.type === "application/pdf" ? ".pdf" : ".png");
  const safe = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads", folder);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, safe), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${folder}/${safe}`;
}

function str(fd: FormData, key: string): string {
  return String(fd.get(key) || "").trim();
}
function int(fd: FormData, key: string, fallback = 0): number {
  const n = Number(String(fd.get(key) || "").replace(/[^\d-]/g, ""));
  return Number.isFinite(n) ? n : fallback;
}
function bool(fd: FormData, key: string): number {
  return fd.get(key) === "on" || fd.get(key) === "1" ? 1 : 0;
}

// ---------------- auth ----------------
export async function login(fd: FormData) {
  const email = str(fd, "email").toLowerCase();
  const password = String(fd.get("password") || "");
  const next = String(fd.get("next") || "/cms");

  const user = await queryOne<{ id: number; name: string; email: string; role: "superadmin" | "editor"; password_hash: string }>(
    "SELECT id, name, email, role, password_hash FROM admin_users WHERE email = ? LIMIT 1",
    [email]
  );

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    redirect(`/cms/login?error=1${next ? `&next=${encodeURIComponent(next)}` : ""}`);
  }

  await execute("UPDATE admin_users SET last_login_at = NOW() WHERE id = ?", [user.id]);
  await createSession({ id: user.id, name: user.name, email: user.email, role: user.role });
  redirect(next.startsWith("/cms") ? next : "/cms");
}

export async function logout() {
  await destroySession();
  redirect("/cms/login");
}

// ---------------- products ----------------
export async function saveProduct(fd: FormData) {
  await requireUser();
  const id = int(fd, "id");
  const name = str(fd, "name");
  if (!name) redirect("/cms/produk?error=Nama produk wajib diisi");

  try {
    const uploaded = await saveUpload(fd.get("image_file") as File | null, "products");
    const image = uploaded || str(fd, "image") || null;
    const slug = str(fd, "slug") ? slugify(str(fd, "slug")) : slugify(name);
    const features = str(fd, "features")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const values = [
      slug,
      name,
      str(fd, "category") || "digital",
      Number(String(fd.get("weight_gram") || "0").replace(",", ".")),
      int(fd, "price"),
      int(fd, "buyback_price"),
      str(fd, "badge") || null,
      str(fd, "short_desc") || null,
      str(fd, "description") || null,
      JSON.stringify(features),
      image,
      bool(fd, "is_featured"),
      bool(fd, "is_active"),
      int(fd, "sort_order"),
    ];

    if (id) {
      await execute(
        `UPDATE products SET slug=?, name=?, category=?, weight_gram=?, price=?, buyback_price=?, badge=?, short_desc=?, description=?, features=?, image=?, is_featured=?, is_active=?, sort_order=? WHERE id=?`,
        [...values, id]
      );
    } else {
      await execute(
        `INSERT INTO products (slug,name,category,weight_gram,price,buyback_price,badge,short_desc,description,features,image,is_featured,is_active,sort_order) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        values
      );
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Gagal menyimpan produk";
    redirect(`/cms/produk?error=${encodeURIComponent(msg)}`);
  }

  revalidatePath("/");
  revalidatePath("/produk");
  redirect("/cms/produk?saved=1");
}

export async function deleteProduct(fd: FormData) {
  await requireUser();
  await execute("DELETE FROM products WHERE id = ?", [int(fd, "id")]);
  revalidatePath("/produk");
  redirect("/cms/produk?deleted=1");
}

export async function toggleProduct(fd: FormData) {
  await requireUser();
  await execute("UPDATE products SET is_active = 1 - is_active WHERE id = ?", [int(fd, "id")]);
  revalidatePath("/produk");
  redirect("/cms/produk");
}

// ---------------- prices ----------------
export async function savePrice(fd: FormData) {
  await requireUser();
  const date = str(fd, "price_date");
  const buy = int(fd, "buy_price");
  const sell = int(fd, "sell_price");
  if (!date || !buy || !sell) redirect("/cms/harga?error=Tanggal dan harga wajib diisi");

  await execute(
    `INSERT INTO gold_prices (price_date, buy_price, sell_price) VALUES (?,?,?)
     ON DUPLICATE KEY UPDATE buy_price=VALUES(buy_price), sell_price=VALUES(sell_price)`,
    [date, buy, sell]
  );
  revalidatePath("/");
  revalidatePath("/harga");
  redirect("/cms/harga?saved=1");
}

export async function deletePrice(fd: FormData) {
  await requireUser();
  await execute("DELETE FROM gold_prices WHERE id = ?", [int(fd, "id")]);
  revalidatePath("/harga");
  redirect("/cms/harga?deleted=1");
}

// ---------------- articles ----------------
export async function saveArticle(fd: FormData) {
  await requireUser();
  const id = int(fd, "id");
  const title = str(fd, "title");
  if (!title) redirect("/cms/artikel?error=Judul wajib diisi");

  try {
    const uploaded = await saveUpload(fd.get("cover_file") as File | null, "articles");
    const cover = uploaded || str(fd, "cover") || null;
    const slug = str(fd, "slug") ? slugify(str(fd, "slug")) : slugify(title);
    const status = str(fd, "status") === "draft" ? "draft" : "published";
    const published = str(fd, "published_at") ? str(fd, "published_at").replace("T", " ") + ":00" : new Date().toISOString().slice(0, 19).replace("T", " ");

    const values = [
      slug,
      title,
      str(fd, "excerpt") || null,
      str(fd, "content") || null,
      cover,
      str(fd, "category") || "Tips",
      str(fd, "author") || "Tim Raja Emas",
      status,
      published,
    ];

    if (id) {
      await execute(
        `UPDATE articles SET slug=?, title=?, excerpt=?, content=?, cover=?, category=?, author=?, status=?, published_at=? WHERE id=?`,
        [...values, id]
      );
    } else {
      await execute(
        `INSERT INTO articles (slug,title,excerpt,content,cover,category,author,status,published_at) VALUES (?,?,?,?,?,?,?,?,?)`,
        values
      );
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Gagal menyimpan artikel";
    redirect(`/cms/artikel?error=${encodeURIComponent(msg)}`);
  }

  revalidatePath("/artikel");
  redirect("/cms/artikel?saved=1");
}

export async function deleteArticle(fd: FormData) {
  await requireUser();
  await execute("DELETE FROM articles WHERE id = ?", [int(fd, "id")]);
  revalidatePath("/artikel");
  redirect("/cms/artikel?deleted=1");
}

export async function toggleArticle(fd: FormData) {
  await requireUser();
  await execute(
    "UPDATE articles SET status = IF(status='published','draft','published'), published_at = IF(published_at IS NULL, NOW(), published_at) WHERE id = ?",
    [int(fd, "id")]
  );
  revalidatePath("/artikel");
  redirect("/cms/artikel");
}

// ---------------- banners ----------------
export async function saveBanner(fd: FormData) {
  await requireUser();
  const id = int(fd, "id");
  const title = str(fd, "title");
  if (!title) redirect("/cms/banner?error=Judul banner wajib diisi");

  try {
    const uploaded = await saveUpload(fd.get("image_file") as File | null, "banners");
    const image = uploaded || str(fd, "image") || null;
    const values = [
      str(fd, "kicker") || null,
      title,
      str(fd, "subtitle") || null,
      image,
      str(fd, "cta_label") || null,
      str(fd, "cta_url") || null,
      bool(fd, "is_active"),
      int(fd, "sort_order"),
    ];
    if (id) {
      await execute("UPDATE banners SET kicker=?, title=?, subtitle=?, image=?, cta_label=?, cta_url=?, is_active=?, sort_order=? WHERE id=?", [...values, id]);
    } else {
      await execute("INSERT INTO banners (kicker,title,subtitle,image,cta_label,cta_url,is_active,sort_order) VALUES (?,?,?,?,?,?,?,?)", values);
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Gagal menyimpan banner";
    redirect(`/cms/banner?error=${encodeURIComponent(msg)}`);
  }
  revalidatePath("/");
  redirect("/cms/banner?saved=1");
}

export async function deleteBanner(fd: FormData) {
  await requireUser();
  await execute("DELETE FROM banners WHERE id = ?", [int(fd, "id")]);
  revalidatePath("/");
  redirect("/cms/banner?deleted=1");
}

export async function toggleBanner(fd: FormData) {
  await requireUser();
  await execute("UPDATE banners SET is_active = 1 - is_active WHERE id = ?", [int(fd, "id")]);
  revalidatePath("/");
  redirect("/cms/banner");
}

// ---------------- downloads ----------------
export async function saveDownload(fd: FormData) {
  await requireUser();
  const id = int(fd, "id");
  const title = str(fd, "title");
  if (!title) redirect("/cms/download?error=Judul wajib diisi");

  let error = "";
  try {
    const uploaded = await saveUpload(fd.get("file_file") as File | null, "downloads");
    const existing = id ? await queryOne<{ file_path: string }>("SELECT file_path FROM downloads WHERE id = ?", [id]) : null;
    const filePath = uploaded || str(fd, "file_path") || existing?.file_path;
    if (!filePath) {
      error = "File wajib diunggah.";
    } else {
      const slug = str(fd, "slug") ? slugify(str(fd, "slug")) : slugify(title);
      const values = [slug, title, str(fd, "description") || null, filePath, bool(fd, "is_active")];
      if (id) {
        await execute("UPDATE downloads SET slug=?, title=?, description=?, file_path=?, is_active=? WHERE id=?", [...values, id]);
      } else {
        await execute("INSERT INTO downloads (slug,title,description,file_path,is_active) VALUES (?,?,?,?,?)", values);
      }
    }
  } catch (e) {
    error = e instanceof Error ? e.message : "Gagal menyimpan file";
  }
  if (error) redirect(`/cms/download?error=${encodeURIComponent(error)}`);
  revalidatePath("/download");
  redirect("/cms/download?saved=1");
}

export async function deleteDownload(fd: FormData) {
  await requireUser();
  await execute("DELETE FROM downloads WHERE id = ?", [int(fd, "id")]);
  revalidatePath("/download");
  redirect("/cms/download?deleted=1");
}

export async function deleteLead(fd: FormData) {
  await requireUser();
  await execute("DELETE FROM leads WHERE id = ?", [int(fd, "id")]);
  revalidatePath("/cms/leads");
  redirect("/cms/leads");
}

// ---------------- messages ----------------
export async function toggleMessage(fd: FormData) {
  await requireUser();
  await execute("UPDATE contact_messages SET is_read = 1 - is_read WHERE id = ?", [int(fd, "id")]);
  redirect("/cms/pesan");
}

export async function deleteMessage(fd: FormData) {
  await requireUser();
  await execute("DELETE FROM contact_messages WHERE id = ?", [int(fd, "id")]);
  redirect("/cms/pesan");
}

// ---------------- faqs ----------------
export async function saveFaq(fd: FormData) {
  await requireUser();
  const question = str(fd, "question");
  const answer = str(fd, "answer");
  if (question && answer) {
    await execute("INSERT INTO faqs (question, answer, sort_order, is_active) VALUES (?,?,?,1)", [question, answer, int(fd, "sort_order")]);
  }
  revalidatePath("/");
  redirect("/cms/faq");
}

export async function saveFaqBulk(fd: FormData) {
  await requireUser();
  const ids = fd.getAll("faq_id").map((v) => Number(v));
  for (const id of ids) {
    const q = String(fd.get(`q_${id}`) || "").trim();
    const a = String(fd.get(`a_${id}`) || "").trim();
    const active = fd.get(`active_${id}`) === "on" ? 1 : 0;
    if (q && a) {
      await execute("UPDATE faqs SET question=?, answer=?, is_active=? WHERE id=?", [q, a, active, id]);
    }
  }
  revalidatePath("/");
  redirect("/cms/faq?saved=1");
}

export async function deleteFaq(fd: FormData) {
  await requireUser();
  await execute("DELETE FROM faqs WHERE id = ?", [int(fd, "id")]);
  revalidatePath("/");
  redirect("/cms/faq?deleted=1");
}

// ---------------- settings ----------------
export async function saveSettings(fd: FormData) {
  await requireUser();
  const keys = [
    "site_name","site_short","tagline","phone","whatsapp","email","address","instagram","tiktok","youtube",
    "operational_hours","about_short","about_long","footer_note","stat_users","stat_customers_label","stat_volume","stat_volume_label","stat_years",
    "stat_years_label","stat_rating","stat_rating_label",
    "app_name","app_tagline","app_badge","play_store_url","app_store_url","app_rating","app_reviews",
  ];
  for (const key of keys) {
    const value = str(fd, key);
    await execute(
      "INSERT INTO settings (setting_key, setting_value) VALUES (?,?) ON DUPLICATE KEY UPDATE setting_value=VALUES(setting_value)",
      [key, value]
    );
  }
  revalidatePath("/");
  revalidatePath("/aplikasi");
  redirect("/cms/pengaturan?saved=1");
}
