import { getLatestPrice, getPreviousPrice } from "@/lib/content";
import { SiteNav } from "./nav-client";

export async function SiteHeader() {
  const [latest, prev] = await Promise.all([getLatestPrice(), getPreviousPrice()]);

  const price = Number(latest?.buy_price || 0);
  const delta = price - Number(prev?.buy_price || price);

  return <SiteNav price={price} delta={delta} />;
}
