import Link from "next/link";

/** The Mzizi mark: a root system drawn as an M under a seedling, on a clay-to-gold tile. Text is the word Mzizi only. */
export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden focusable="false">
      <defs>
        <linearGradient id="mzizi-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="oklch(0.585 0.152 41)" />
          <stop offset="1" stopColor="oklch(0.735 0.138 76)" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="13" fill="url(#mzizi-mark)" />
      <g fill="none" stroke="oklch(0.985 0.009 85)" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13.5 33.5V19.5L24 29l10.5-9.5v14" />
        <path d="M24 29v11.5M24 36l-5 4M24 36l5 4" />
      </g>
      <circle cx="24" cy="11.8" r="3.1" fill="oklch(0.985 0.009 85)" />
    </svg>
  );
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" aria-label="Mzizi home" className="flex shrink-0 items-center gap-2.5">
      <LogoMark />
      {compact ? null : <span className="font-display text-[1.65rem] font-semibold leading-none tracking-tight text-content-primary">Mzizi</span>}
    </Link>
  );
}
