/**
 * Shimmering placeholders that hold the exact space of what will load, so the page paints at once and nothing jumps
 * when data arrives. Server-safe: no hooks. The shimmer stops under the reduced-motion preference (see real.css).
 */
import type { CSSProperties } from "react";

export function Skeleton({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return <span aria-hidden className={`shimmer block rounded-md ${className}`} style={style} />;
}

/** The heading block of a page: label, title and introduction. */
/** The heading block of a page: a label, a title and one line of introduction. */
export function SkeletonHeader() {
  return (
    <div aria-hidden className="mb-8 max-w-3xl">
      <Skeleton className="h-3 w-32" />
      <Skeleton className="mt-4 h-10 w-2/3 max-w-md" />
      <Skeleton className="mt-5 h-3.5 w-full max-w-xl" />
    </div>
  );
}

export function SkeletonPanel({ height = 220, className = "" }: { height?: number; className?: string }) {
  return <Skeleton className={`w-full rounded-lg ${className}`} style={{ height }} />;
}

/** A page of the app before its data arrives: the heading and two blocks. */
export function PageSkeleton() {
  return (
    <div role="status" aria-busy="true" aria-live="polite">
      <SkeletonHeader />
      <div className="grid gap-4 lg:grid-cols-2">
        <SkeletonPanel height={240} />
        <SkeletonPanel height={240} />
      </div>
    </div>
  );
}

/** Rows of a list inside a popover or panel. */
export function SkeletonRows({ rows = 6 }: { rows?: number }) {
  return (
    <ul aria-hidden className="space-y-2 px-3 py-2">
      {Array.from({ length: rows }, (_, i) => (
        <li key={i}>
          <Skeleton className="h-8 w-full" />
        </li>
      ))}
    </ul>
  );
}
