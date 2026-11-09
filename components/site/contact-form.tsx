"use client";

import { useActionState } from "react";
import { ArrowRight, Check } from "@/components/icons";
import { submitContact, type ContactState } from "@/lib/actions/public";

const initial: ContactState = { status: "idle" };

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, initial);

  return (
    <form action={action} className="space-y-3.5">
      <div className="grid gap-3.5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="c-name">Nama lengkap</label>
          <input id="c-name" name="name" required className="field" placeholder="Nama Anda" />
        </div>
        <div>
          <label className="label" htmlFor="c-email">Email</label>
          <input id="c-email" name="email" type="email" required className="field" placeholder="nama@email.com" />
        </div>
      </div>
      <div className="grid gap-3.5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="c-phone">Nomor WhatsApp</label>
          <input id="c-phone" name="phone" className="field" placeholder="0812xxxxxxx" />
        </div>
        <div>
          <label className="label" htmlFor="c-subject">Topik</label>
          <select id="c-subject" name="subject" className="field">
            <option>Informasi produk</option>
            <option>Pembelian &amp; pembayaran</option>
            <option>Cetak emas fisik</option>
            <option>Kerja sama korporasi</option>
            <option>Lainnya</option>
          </select>
        </div>
      </div>
      <div>
        <label className="label" htmlFor="c-message">Pesan</label>
        <textarea id="c-message" name="message" required rows={5} className="field-area" placeholder="Ceritakan kebutuhan Anda…" />
      </div>

      {state.status === "success" && (
        <div className="flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-[12px] text-emerald-900">
          <Check width={16} height={16} className="mt-0.5 shrink-0" /> {state.message}
        </div>
      )}
      {state.status === "error" && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-[12px] text-rose-800">{state.message}</div>
      )}

      <button type="submit" disabled={pending} className="btn btn-md btn-primary w-full sm:w-auto">
        {pending ? "Mengirim…" : "Kirim pesan"} <ArrowRight width={16} height={16} />
      </button>
    </form>
  );
}
