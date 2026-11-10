import { query, queryOne } from "./db";
import type { Article, Banner, DownloadItem, Faq, GoldPrice, Product } from "./types";

export const CATEGORY_LABEL: Record<string, string> = {
  digital: "Emas Digital",
  fisik: "Emas Fisik",
  gift: "Emas Gift",
};

function parseFeatures(value: unknown): string[] {
  if (Array.isArray(value)) return value as string[];
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

export async function getLatestPrice(): Promise<GoldPrice | null> {
  return queryOne<GoldPrice>(
    "SELECT id, price_date, buy_price, sell_price FROM gold_prices ORDER BY price_date DESC LIMIT 1"
  );
}

export async function getPreviousPrice(): Promise<GoldPrice | null> {
  return queryOne<GoldPrice>(
    "SELECT id, price_date, buy_price, sell_price FROM gold_prices ORDER BY price_date DESC LIMIT 1 OFFSET 1"
  );
}

export async function getPriceSeries(days = 90): Promise<GoldPrice[]> {
  const rows = await query<GoldPrice>(
    "SELECT id, price_date, buy_price, sell_price FROM gold_prices ORDER BY price_date DESC LIMIT ?",
    [days]
  );
  return rows.reverse();
}

export async function getProducts(opts: { featured?: boolean; category?: string } = {}): Promise<Product[]> {
  const where = ["is_active = TRUE"];
  const params: unknown[] = [];
  if (opts.featured) where.push("is_featured = TRUE");
  if (opts.category && opts.category !== "semua") {
    where.push("category = ?");
    params.push(opts.category);
  }
  const rows = await query<Product & { features: unknown }>(
    `SELECT * FROM products WHERE ${where.join(" AND ")} ORDER BY sort_order ASC, id ASC`,
    params
  );
  return rows.map((r) => ({ ...r, features: parseFeatures(r.features) }));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const row = await queryOne<Product & { features: unknown }>(
    "SELECT * FROM products WHERE slug = ? LIMIT 1",
    [slug]
  );
  if (!row) return null;
  return { ...row, features: parseFeatures(row.features) };
}

export async function getRelatedProducts(slug: string, category: string): Promise<Product[]> {
  const rows = await query<Product & { features: unknown }>(
    "SELECT * FROM products WHERE is_active = TRUE AND slug <> ? AND category = ? ORDER BY sort_order LIMIT 3",
    [slug, category]
  );
  return rows.map((r) => ({ ...r, features: parseFeatures(r.features) }));
}

export async function getArticles(opts: { limit?: number; category?: string; includeDraft?: boolean } = {}): Promise<Article[]> {
  const where: string[] = [];
  const params: unknown[] = [];
  if (!opts.includeDraft) where.push("status = 'published'");
  if (opts.category) {
    where.push("category = ?");
    params.push(opts.category);
  }
  const limit = Math.min(opts.limit ?? 50, 200);
  const sql = `SELECT * FROM articles ${where.length ? "WHERE " + where.join(" AND ") : ""} ORDER BY published_at DESC, id DESC LIMIT ${limit}`;
  return query<Article>(sql, params);
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  return queryOne<Article>("SELECT * FROM articles WHERE slug = ? LIMIT 1", [slug]);
}

export async function getDownloads(): Promise<DownloadItem[]> {
  return query<DownloadItem>(
    `SELECT d.*, (SELECT COUNT(*) FROM leads l WHERE l.download_id = d.id) AS leads_count
     FROM downloads d WHERE d.is_active = TRUE ORDER BY d.id ASC`
  );
}

export async function getFaqs(): Promise<Faq[]> {
  return query<Faq>("SELECT * FROM faqs WHERE is_active = TRUE ORDER BY sort_order ASC, id ASC");
}

export async function getBanners(): Promise<Banner[]> {
  return query<Banner>("SELECT * FROM banners WHERE is_active = TRUE ORDER BY sort_order ASC, id ASC");
}
