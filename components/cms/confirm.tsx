"use client";

import { useState } from "react";
import { Trash } from "@/components/icons";

export function ConfirmSubmit({
  label,
  className = "",
  message = "Yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.",
  icon = true,
}: {
  label?: string;
  className?: string;
  message?: string;
  icon?: boolean;
}) {
  const [confirming, setConfirming] = useState(false);
  if (confirming) {
    return (
      <span className="inline-flex items-center gap-1">
        <button type="submit" className="inline-flex h-7 items-center rounded-lg bg-rose-600 px-2 text-[10px] font-bold text-white">
          Hapus
        </button>
        <button type="button" onClick={() => setConfirming(false)} className="inline-flex h-7 items-center rounded-lg border border-brand-900/10 px-2 text-[10px] font-semibold text-brand-700">
          Batal
        </button>
      </span>
    );
  }
  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className={className || "inline-flex h-7 w-7 items-center justify-center rounded-lg border border-brand-900/10 text-brand-900/45 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600"}
      title={label || "Hapus"}
      aria-label={label || "Hapus"}
    >
      {icon ? <Trash width={14} height={14} /> : label}
    </button>
  );
}
