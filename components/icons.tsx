import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

const base = (p: P) => ({
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  ...p,
});

export const ArrowRight = (p: P) => (
  <svg {...base(p)}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const ArrowLeft = (p: P) => (
  <svg {...base(p)}><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
);
export const ArrowUpRight = (p: P) => (
  <svg {...base(p)}><path d="M7 17 17 7M8 7h9v9" /></svg>
);
export const ArrowUp = (p: P) => (
  <svg {...base(p)}><path d="M12 19V5M6 11l6-6 6 6" /></svg>
);
export const ArrowDown = (p: P) => (
  <svg {...base(p)}><path d="M12 5v14M6 13l6 6 6-6" /></svg>
);
export const Heart = (p: P) => (
  <svg {...base(p)}><path d="M12 20s-7-4.4-7-9.2A4 4 0 0 1 12 8a4 4 0 0 1 7 2.8C19 15.6 12 20 12 20Z" /></svg>
);
export const Check = (p: P) => (
  <svg {...base(p)}><path d="m5 12 4.2 4.2L19 6.5" /></svg>
);
export const CheckCircle = (p: P) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="m8.5 12 2.4 2.4 4.8-5" /></svg>
);
export const ChevronDown = (p: P) => (
  <svg {...base(p)}><path d="m6 9 6 6 6-6" /></svg>
);
export const ChevronLeft = (p: P) => (
  <svg {...base(p)}><path d="m15 6-6 6 6 6" /></svg>
);
export const ChevronRight = (p: P) => (
  <svg {...base(p)}><path d="m9 6 6 6-6 6" /></svg>
);
export const Menu = (p: P) => (
  <svg {...base(p)}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
);
export const Close = (p: P) => (
  <svg {...base(p)}><path d="m6 6 12 12M18 6 6 18" /></svg>
);
export const Shield = (p: P) => (
  <svg {...base(p)}><path d="M12 3 5 6v5c0 4.6 2.9 8.2 7 10 4.1-1.8 7-5.4 7-10V6l-7-3Z" /><path d="m9 12 2 2 4-4.5" /></svg>
);
export const Lock = (p: P) => (
  <svg {...base(p)}><rect x="4.5" y="10" width="15" height="10.5" rx="2.5" /><path d="M8 10V7.5a4 4 0 0 1 8 0V10M12 14v2.5" /></svg>
);
export const Wallet = (p: P) => (
  <svg {...base(p)}><path d="M4 8.5A2.5 2.5 0 0 1 6.5 6H19a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H6.5A2.5 2.5 0 0 1 4 16.5v-8Z" /><path d="M4 9h16M16 13.5h2.5" /></svg>
);
export const Chart = (p: P) => (
  <svg {...base(p)}><path d="M4 20V5M4 20h16" /><path d="m7 15 3.5-4 3 2.5L20 7" /></svg>
);
export const TrendingUp = (p: P) => (
  <svg {...base(p)}><path d="m3 16 5.5-5.5 3.5 3L21 5" /><path d="M15 5h6v6" /></svg>
);
export const TrendingDown = (p: P) => (
  <svg {...base(p)}><path d="m3 8 5.5 5.5 3.5-3L21 19" /><path d="M15 19h6v-6" /></svg>
);
export const Printer = (p: P) => (
  <svg {...base(p)}><path d="M7 8V4h10v4M7 16H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2" /><rect x="7" y="14" width="10" height="6.5" rx="1" /></svg>
);
export const Sparkle = (p: P) => (
  <svg {...base(p)}><path d="M12 3.5c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7Z" /><path d="M18.5 15.5c.25 1.9 1 2.65 2.9 2.9-1.9.25-2.65 1-2.9 2.9-.25-1.9-1-2.65-2.9-2.9 1.9-.25 2.65-1 2.9-2.9Z" /></svg>
);
export const DownloadIcon = (p: P) => (
  <svg {...base(p)}><path d="M12 4v10M8 10l4 4 4-4" /><path d="M4 17v2a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 20 19v-2" /></svg>
);
export const Book = (p: P) => (
  <svg {...base(p)}><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" /><path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H20M8 7h8" /></svg>
);
export const Clock = (p: P) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="M12 7v5.3l3.5 2" /></svg>
);
export const Phone = (p: P) => (
  <svg {...base(p)}><path d="M6.6 3.5h2.2l1.5 3.8-2 1.32a12.3 12.3 0 0 0 5.7 5.7l1.32-2 3.8 1.5v2.2a2.5 2.5 0 0 1-2.7 2.5A16.4 16.4 0 0 1 4.1 6.2 2.5 2.5 0 0 1 6.6 3.5Z" /></svg>
);
export const Mail = (p: P) => (
  <svg {...base(p)}><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m4 7 8 6 8-6" /></svg>
);
export const MapPin = (p: P) => (
  <svg {...base(p)}><path d="M12 21c4-4.2 7-7.4 7-11a7 7 0 1 0-14 0c0 3.6 3 6.8 7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg>
);
export const Instagram = (p: P) => (
  <svg {...base(p)}><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r=".8" fill="currentColor" stroke="none" /></svg>
);
export const Users = (p: P) => (
  <svg {...base(p)}><circle cx="9" cy="8" r="3.2" /><path d="M3.5 20a5.5 5.5 0 0 1 11 0M16 5.2a3 3 0 0 1 0 5.6M17.5 14.5a5.5 5.5 0 0 1 3 5" /></svg>
);
export const Gem = (p: P) => (
  <svg {...base(p)}><path d="M7 3.5h10l4 5.5-9 11.5L3 9l4-5.5Z" /><path d="M3 9h18M7 3.5 9.5 9l2.5 11.5L14.5 9 17 3.5" /></svg>
);
export const Coins = (p: P) => (
  <svg {...base(p)}><ellipse cx="9" cy="6.5" rx="5.5" ry="2.5" /><path d="M3.5 6.5v5c0 1.4 2.5 2.5 5.5 2.5s5.5-1.1 5.5-2.5v-5" /><path d="M9 14v3c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5v-5c0-1.2-1.7-2.2-4-2.45" /></svg>
);
export const Search = (p: P) => (
  <svg {...base(p)}><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></svg>
);
export const Plus = (p: P) => (
  <svg {...base(p)}><path d="M12 5v14M5 12h14" /></svg>
);
export const Pencil = (p: P) => (
  <svg {...base(p)}><path d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17v3Z" /><path d="m14.5 7.5 2 2" /></svg>
);
export const Trash = (p: P) => (
  <svg {...base(p)}><path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13" /><path d="M10 11v5M14 11v5" /></svg>
);
export const Eye = (p: P) => (
  <svg {...base(p)}><path d="M2.5 12S6 6 12 6s9.5 6 9.5 6-3.5 6-9.5 6S2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="2.6" /></svg>
);
export const LogOut = (p: P) => (
  <svg {...base(p)}><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 8l-4 4 4 4M6 12h9" /></svg>
);
export const Dashboard = (p: P) => (
  <svg {...base(p)}><rect x="3.5" y="3.5" width="7" height="7" rx="1.5" /><rect x="13.5" y="3.5" width="7" height="7" rx="1.5" /><rect x="3.5" y="13.5" width="7" height="7" rx="1.5" /><rect x="13.5" y="13.5" width="7" height="7" rx="1.5" /></svg>
);
export const Package = (p: P) => (
  <svg {...base(p)}><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" /><path d="m4.2 7.7 7.8 4.4 7.8-4.4M12 21v-8.9" /></svg>
);
export const Tag = (p: P) => (
  <svg {...base(p)}><path d="M12.5 3.5H20v7.5l-8.6 8.6a1.8 1.8 0 0 1-2.6 0l-5-5a1.8 1.8 0 0 1 0-2.6l8.7-8.5Z" /><circle cx="16.5" cy="7.5" r="1.2" /></svg>
);
export const FileText = (p: P) => (
  <svg {...base(p)}><path d="M6 3.5h7l5 5V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" /><path d="M13 3.5V9h5M8.5 13h7M8.5 17h4" /></svg>
);
export const ImageIcon = (p: P) => (
  <svg {...base(p)}><rect x="3.5" y="4" width="17" height="16" rx="2.5" /><circle cx="9" cy="9.5" r="1.6" /><path d="m5 17 4.5-4.5 4 3.5L17 12l2.5 2.5" /></svg>
);
export const SettingsIcon = (p: P) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="3" /><path d="M19.4 13.5a7.7 7.7 0 0 0 .05-3l1.7-1.3-1.8-3.1-2 .8a7.6 7.6 0 0 0-2.6-1.5L14.5 3h-3.6l-.3 2.2a7.6 7.6 0 0 0-2.6 1.5l-2-.8L4.2 9l1.7 1.3a7.7 7.7 0 0 0 0 3.1L4.2 15l1.8 3.1 2-.8a7.6 7.6 0 0 0 2.6 1.5l.3 2.2h3.6l.3-2.2a7.6 7.6 0 0 0 2.6-1.5l2 .8 1.8-3.1-1.8-1.5Z" /></svg>
);
export const Message = (p: P) => (
  <svg {...base(p)}><path d="M20.5 11.5a8 8 0 0 1-11.7 7.1L4 20l1.4-4.6a8 8 0 1 1 15.1-3.9Z" /></svg>
);
export const Inbox = (p: P) => (
  <svg {...base(p)}><path d="M3.5 13.5 6 5h12l2.5 8.5v5a1.5 1.5 0 0 1-1.5 1.5H5a1.5 1.5 0 0 1-1.5-1.5v-5Z" /><path d="M3.5 13.5H8l1 2.5h6l1-2.5h4.5" /></svg>
);
export const Refresh = (p: P) => (
  <svg {...base(p)}><path d="M20 5v5h-5M4 19v-5h5" /><path d="M6.2 8.5A7.5 7.5 0 0 1 20 10M4 14a7.5 7.5 0 0 0 13.8 1.5" /></svg>
);
export const External = (p: P) => (
  <svg {...base(p)}><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></svg>
);
export const Banknote = (p: P) => (
  <svg {...base(p)}><rect x="2.5" y="6" width="19" height="12" rx="2" /><circle cx="12" cy="12" r="2.6" /><path d="M6 9.5v.01M18 14.5v.01" /></svg>
);
export const Star = (p: P) => (
  <svg {...base(p)}><path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L12 3.5Z" /></svg>
);
export const Quote = (p: P) => (
  <svg {...base(p)}><path d="M9.5 6C6.5 7.4 5 9.7 5 13v5h5v-6H7.4c.15-1.8 1-3 2.6-3.8L9.5 6ZM19.5 6c-3 1.4-4.5 3.7-4.5 7v5h5v-6h-2.6c.15-1.8 1-3 2.6-3.8L19.5 6Z" /></svg>
);
export const Whatsapp = (p: P) => (
  <svg {...base(p)}><path d="M20.5 11.6a8.4 8.4 0 0 1-12.4 7.4L3.5 20.5l1.5-4.5a8.4 8.4 0 1 1 15.5-4.4Z" /><path d="M9 8.2c-.3 1.4.5 3.4 2.6 5 1.6 1.3 3.3 1.9 4.3 1.5.4-.2.7-.8.8-1.3l-1.6-.8-.8.8c-.9-.3-2.3-1.5-2.8-2.5l.8-.8-.7-1.7c-.7 0-1.3.2-1.6.6" /></svg>
);
export const Compass = (p: P) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" /></svg>
);
export const Calendar = (p: P) => (
  <svg {...base(p)}><rect x="3.5" y="5" width="17" height="15.5" rx="2" /><path d="M8 3v4M16 3v4M3.5 10h17" /></svg>
);
export const Apple = (p: P) => (
  <svg {...base(p)} fill="currentColor" stroke="none">
    <path d="M16.37 1.43c0 1.14-.42 2.2-1.26 3.18-.86.99-1.88 1.56-3.08 1.47a4.6 4.6 0 0 1-.05-.54c0-1.1.47-2.15 1.3-3.1.42-.48.9-.87 1.46-1.18.56-.31 1.08-.48 1.58-.51.03.23.05.45.05.68Zm2.93 15.62c-.25.72-.55 1.38-.9 1.99-.48.83-.87 1.4-1.18 1.72-.48.48-.99.73-1.54.75-.4 0-.88-.12-1.44-.35-.56-.23-1.08-.35-1.55-.35-.5 0-1.03.12-1.6.35-.58.24-1.05.36-1.42.37-.53.02-1.05-.24-1.57-.78-.33-.35-.74-.94-1.23-1.78-.53-.9-.96-1.94-1.3-3.13-.36-1.29-.54-2.54-.54-3.75 0-1.39.3-2.58.9-3.58.47-.8 1.1-1.43 1.88-1.9.79-.46 1.64-.7 2.55-.72.42 0 .98.13 1.67.39.69.26 1.13.39 1.32.39.15 0 .64-.15 1.46-.45.79-.28 1.45-.4 2-.36 1.48.12 2.6.71 3.34 1.77-1.32.8-1.97 1.92-1.96 3.36.01 1.12.42 2.05 1.22 2.79.36.34.77.61 1.22.8-.1.28-.2.55-.31.81Z" />
  </svg>
);
export const PlayStore = (p: P) => (
  <svg {...base(p)} stroke="none">
    <path fill="#00C4FF" d="M3.1 2.2c-.3.3-.5.8-.5 1.4v16.8c0 .6.2 1.1.5 1.4l.1.1 9.4-9.4v-.2L3.1 2.2Z" />
    <path fill="#FFCE00" d="m15.7 15.5-3.1-3.1v-.2l3.2-3.2.1.1 3.8 2.2c1.1.6 1.1 1.6 0 2.2l-4 2Z" />
    <path fill="#FF3A44" d="M15.8 15.4 12.6 12.1 3.1 21.7c.4.4 1 .4 1.6.1l11.1-6.4Z" />
    <path fill="#00E676" d="M15.8 8.6 4.7 2.2c-.6-.3-1.2-.3-1.6.1l9.5 9.5 3.2-3.2Z" />
  </svg>
);
export const Smartphone = (p: P) => (
  <svg {...base(p)}><rect x="6.5" y="2.5" width="11" height="19" rx="2.5" /><path d="M10.5 5.5h3M11 18.5h2" /></svg>
);
