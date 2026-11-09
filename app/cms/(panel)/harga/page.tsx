import { ArrowDown, ArrowUp, Plus, Tag } from "@/components/icons";
import { ConfirmSubmit } from "@/components/cms/confirm";
import { Card, Flash, PageHead, StatCard, TableWrap, Td, Th } from "@/components/cms/ui";
import { deletePrice, savePrice } from "@/lib/actions/admin";
import { PriceChart } from "@/components/site/price-chart";
import { getLatestPrice, getPreviousPrice, getPriceSeries } from "@/lib/content";
import { query } from "@/lib/db";
import { formatDate, money, shortDate } from "@/lib/format";

export const metadata = { title: "Harga Emas — CMS" };

export default async function CmsPricePage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const [latest, prev, series, rows] = await Promise.all([
    getLatestPrice(),
    getPreviousPrice(),
    getPriceSeries(180),
    query<{ id: number; price_date: string; buy_price: number; sell_price: number }>(
      "SELECT id, price_date, buy_price, sell_price FROM gold_prices ORDER BY price_date DESC LIMIT 60"
    ),
  ]);

  const today = new Date().toISOString().slice(0, 10);
  const delta = Number(latest?.buy_price || 0) - Number(prev?.buy_price || 0);
  const spread = Number(latest?.buy_price || 0) - Number(latest?.sell_price || 0);

  return (
    <>
      <PageHead
        title="Harga Emas"
        description="Perbarui harga beli dan buyback harian. Data terbaru otomatis tampil di seluruh halaman situs."
      />
      <Flash saved={sp.saved} deleted={sp.deleted} error={sp.error} />

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Harga beli terakhir" value={money(latest?.buy_price)} hint={formatDate(latest?.price_date)} icon={ArrowUp} tone="dark" />
        <StatCard label="Harga buyback" value={money(latest?.sell_price)} hint={`Spread ${money(spread)}`} icon={ArrowDown} tone="gold" />
        <StatCard label="Selisih harian" value={`${delta >= 0 ? "+" : ""}${money(delta)}`} hint="Dibanding hari sebelumnya" icon={Tag} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[0.9fr_1.6fr]">
        <Card className="p-5">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-900 text-gold-300"><Tag width={15} height={15} /></span>
            <div>
              <p className="text-[12.5px] font-bold text-brand-900">Input / perbarui harga</p>
              <p className="text-[10px] text-brand-900/40">Tanggal yang sama akan diperbarui.</p>
            </div>
          </div>
          <form action={savePrice} className="mt-4 space-y-3.5">
            <div>
              <label className="label" htmlFor="price_date">Tanggal</label>
              <input id="price_date" name="price_date" type="date" required defaultValue={latest?.price_date || today} className="field" />
            </div>
            <div>
              <label className="label" htmlFor="buy_price">Harga beli / gram (Rp)</label>
              <input id="buy_price" name="buy_price" required inputMode="numeric" defaultValue={latest?.buy_price || ""} className="field" placeholder="2572000" />
            </div>
            <div>
              <label className="label" htmlFor="sell_price">Harga buyback / gram (Rp)</label>
              <input id="sell_price" name="sell_price" required inputMode="numeric" defaultValue={latest?.sell_price || ""} className="field" placeholder="2450000" />
            </div>
            <button type="submit" className="btn btn-md btn-primary w-full"><Plus width={15} height={15} /> Simpan harga</button>
            <p className="text-[10px] leading-relaxed text-brand-900/35">Gunakan angka tanpa titik atau koma. Buyback umumnya 2–5% di bawah harga beli.</p>
          </form>
        </Card>

        <Card className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[12.5px] font-bold text-brand-900">Tren 6 bulan</p>
            <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[9.5px] font-semibold text-brand-700">180 hari</span>
          </div>
          <PriceChart data={series} compact defaultRange={180} />
        </Card>
      </div>

      <Card className="mt-4">
        <div className="flex items-center justify-between border-b border-brand-900/8 px-5 py-3.5">
          <p className="text-[12.5px] font-bold text-brand-900">Riwayat harga</p>
          <p className="text-[10px] text-brand-900/40">{rows.length} entri terakhir</p>
        </div>
        <TableWrap>
          <thead>
            <tr className="border-b border-brand-900/8">
              <Th>Tanggal</Th>
              <Th>Harga beli</Th>
              <Th>Buyback</Th>
              <Th>Spread</Th>
              <Th className="text-right">Aksi</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-900/[0.05]">
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-brand-50/40">
                <Td><span className="font-medium text-brand-900">{shortDate(r.price_date)}</span></Td>
                <Td><span className="num font-semibold text-brand-900">{money(r.buy_price)}</span></Td>
                <Td><span className="num text-brand-900/60">{money(r.sell_price)}</span></Td>
                <Td><span className="num text-brand-900/45">{money(Number(r.buy_price) - Number(r.sell_price))}</span></Td>
                <Td>
                  <div className="flex justify-end">
                    <form action={deletePrice}>
                      <input type="hidden" name="id" value={r.id} />
                      <ConfirmSubmit message="Hapus data harga ini?" />
                    </form>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </Card>
    </>
  );
}
