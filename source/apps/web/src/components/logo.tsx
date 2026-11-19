/**
 * Mzizi mark and sitemark. The identity is the shape (an M whose middle stroke is a trunk forking into roots) and the
 * way the name is lettered, never a colour: everything is drawn in `currentColor`, so every palette, light, dark
 * and contrast mode works without a variant.
 */
export function Mark({ size = 28, className = "", title }: { size?: number; className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true} fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5.5 23.5V7.5L16 17.5L26.5 7.5V23.5" /><path d="M16 17.5V25.5" /><path d="M16 25.5L11.8 29M16 25.5L20.2 29" /><path d="M5.5 23.5L3.2 26M26.5 23.5L28.8 26" />
    </svg>
  );
}

/** A seed-shaped dot for the i: a small leaf turned on its side, the same stroke weight family as the mark. */
const Seed = () => <span aria-hidden className="absolute left-1/2 top-[0.1em] h-[0.2em] w-[0.2em] -translate-x-1/2 rotate-45 rounded-[0.12em_0.02em_0.12em_0.02em] bg-accent" />;
const I = () => <span className="relative inline-block">ı<Seed /></span>;

/**
 * The name set in soft, rounded Fraunces with tight spacing, a heavier M, and the two i's dotted with seeds.
 * Screen readers read it as one word.
 */
export function Wordmark({ className = "text-[26px]" }: { className?: string }) {
  return (
    <span className={`font-display font-semibold leading-none tracking-[-0.035em] ${className}`} style={{ fontVariationSettings: '"SOFT" 100, "WONK" 1, "opsz" 72' }} role="img" aria-label="Mzizi">
      <span aria-hidden>M<span className="relative -ml-[0.02em]">z</span><I />z<I /></span>
    </span>
  );
}

/** Mark plus wordmark. `compact` shows the mark alone (icon-only sidebar). */
export function Logo({ compact = false, markSize = 30 }: { compact?: boolean; markSize?: number }) {
  return (
    <span className="flex items-center gap-2.5 text-ink">
      <Mark size={markSize} className="shrink-0 text-accent" title={compact ? "Mzizi" : undefined} />
      {!compact && <Wordmark />}
    </span>
  );
}
