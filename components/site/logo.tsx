import Image from "next/image";
import Link from "next/link";

export function Logo({
  variant = "dark",
  height = 38,
  href = "/",
}: {
  variant?: "dark" | "light";
  height?: number;
  href?: string;
}) {
  return (
    <Link href={href} className="inline-flex items-center gap-2.5" aria-label="Raja Emas Indonesia">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-rei.png"
        alt="Raja Emas Indonesia"
        width={Math.round((height * 1280) / 272)}
        height={height}
        className="w-auto"
        style={{ height, width: "auto" }}
      />
      {variant === "light" && <span className="sr-only">Raja Emas Indonesia</span>}
    </Link>
  );
}

export function Emblem({ size = 40 }: { size?: number }) {
  return (
    <Image
      src="/logo-rei-2.png"
      alt=""
      width={Math.round((size * 215) / 272)}
      height={size}
      className="w-auto"
      style={{ height: size, width: "auto" }}
    />
  );
}
