import { ChevronDown } from "@/components/icons";
import type { Faq } from "@/lib/types";

export function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="divide-y divide-brand-900/10 overflow-hidden rounded-2xl border border-brand-900/10 bg-white">
      {faqs.map((f, i) => (
        <details key={f.id} className="group" open={i === 0}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[13.5px] font-semibold text-brand-900 transition hover:bg-brand-50/60 [&::-webkit-details-marker]:hidden">
            {f.question}
            <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-brand-900/10 text-brand-700 transition group-open:rotate-180 group-open:border-gold-500 group-open:bg-gold-500 group-open:text-brand-950">
              <ChevronDown width={14} height={14} />
            </span>
          </summary>
          <div className="px-5 pb-5 text-[12.5px] leading-relaxed text-brand-900/60">{f.answer}</div>
        </details>
      ))}
    </div>
  );
}
