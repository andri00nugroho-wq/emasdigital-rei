export type GoldPrice = {
  id: number;
  price_date: string;
  buy_price: number;
  sell_price: number;
};

export type Product = {
  id: number;
  slug: string;
  name: string;
  category: string;
  weight_gram: number;
  price: number;
  buyback_price: number;
  badge: string | null;
  short_desc: string | null;
  description: string | null;
  features: string[];
  image: string | null;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
};

export type Article = {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  cover: string | null;
  category: string;
  author: string;
  status: "draft" | "published";
  views: number;
  published_at: string | null;
  created_at: string;
};

export type DownloadItem = {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  file_path: string;
  cover: string | null;
  download_count: number;
  is_active: boolean;
  created_at: string;
  leads_count?: number;
};

export type Lead = {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  download_id: number | null;
  download_title?: string | null;
  source: string;
  created_at: string;
};

export type ContactMessage = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
};

export type Banner = {
  id: number;
  kicker: string | null;
  title: string;
  subtitle: string | null;
  image: string | null;
  cta_label: string | null;
  cta_url: string | null;
  is_active: boolean;
  sort_order: number;
};

export type Faq = {
  id: number;
  question: string;
  answer: string;
  sort_order: number;
  is_active: boolean;
};
