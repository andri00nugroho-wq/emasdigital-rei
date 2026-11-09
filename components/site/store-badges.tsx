import { Apple, PlayStore } from "@/components/icons";

export const DEFAULT_PLAY_STORE =
  "https://play.google.com/store/apps/details?id=com.rajaemasmurni";
export const DEFAULT_APP_STORE =
  "https://apps.apple.com/id/app/raja-emas/id6742871347?l=id";

type Tone = "dark" | "light";

function StoreBadge({
  href,
  tone,
  size,
  label,
  children,
}: {
  href: string;
  tone: Tone;
  size: "md" | "lg";
  label: string;
  children: React.ReactNode;
}) {
  const surface =
    tone === "dark"
      ? "border-white/20 bg-brand-950 text-white hover:border-white/45 hover:bg-black"
      : "border-brand-900/12 bg-brand-950 text-white hover:border-brand-900/30 hover:bg-black";

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`group inline-flex items-center gap-2.5 rounded-[13px] border ${surface} ${
        size === "lg" ? "h-[54px] px-4" : "h-[48px] px-3.5"
      } transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-16px_rgba(15,5,44,0.8)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2`}
      aria-label={label}
    >
      {children}
    </a>
  );
}

export function StoreBadges({
  playUrl,
  appStoreUrl,
  tone = "dark",
  size = "md",
  className = "",
}: {
  playUrl?: string;
  appStoreUrl?: string;
  tone?: Tone;
  size?: "md" | "lg";
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap items-center gap-2.5 ${className}`}>
      <StoreBadge href={playUrl || DEFAULT_PLAY_STORE} tone={tone} size={size} label="Unduh aplikasi di Google Play">
        <PlayStore width={size === "lg" ? 23 : 20} height={size === "lg" ? 23 : 20} />
        <span className="text-left leading-none">
          <span className={`block text-[8px] font-medium uppercase tracking-[0.14em] ${tone === "dark" ? "text-white/55" : "text-white/60"}`}>
            Dapatkan di
          </span>
          <span className={`mt-1 block font-semibold tracking-tight ${size === "lg" ? "text-[17px]" : "text-[15.5px]"}`}>
            Google Play
          </span>
        </span>
      </StoreBadge>

      <StoreBadge href={appStoreUrl || DEFAULT_APP_STORE} tone={tone} size={size} label="Unduh aplikasi di App Store">
        <Apple width={size === "lg" ? 24 : 21} height={size === "lg" ? 24 : 21} className="-mt-0.5" />
        <span className="text-left leading-none">
          <span className={`block text-[8px] font-medium uppercase tracking-[0.14em] ${tone === "dark" ? "text-white/55" : "text-white/60"}`}>
            Unduh di
          </span>
          <span className={`mt-1 block font-semibold tracking-tight ${size === "lg" ? "text-[17px]" : "text-[15.5px]"}`}>
            App Store
          </span>
        </span>
      </StoreBadge>
    </div>
  );
}
