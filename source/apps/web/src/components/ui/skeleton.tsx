/**
 * Shimmering placeholders that hold the exact space of what will load, so the page paints at once and nothing jumps
 * when data arrives. Server-safe: no hooks. The shimmer stops under the reduced-motion preference (see real.css).
 */
import type { CSSProperties } from "react";

export function Skeleton({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return <span aria-hidden className={`shimmer block rounded-md ${className}`} style={style} />;
}

/** Lines of text; the last is shorter, as paragraphs are. */
export function SkeletonText({ lines = 3, className = "" }: { lines?: number; className?: string }) {
  return (
    <span aria-hidden className={`block space-y-2.5 ${className}`}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} className="h-3.5" style={{ width: i === lines - 1 && lines > 1 ? "62%" : "100%" }} />
      ))}
    </span>
  );
}

/** The heading block of a page: label, title and introduction. */
export function SkeletonHeader() {
  return (
    <div aria-hidden className="mb-8 max-w-3xl">
      <Skeleton className="h-3 w-40" />
      <Skeleton className="mt-4 h-11 w-3/4 max-w-xl md:h-14" />
      <SkeletonText lines={2} className="mt-5 max-w-2xl" />
    </div>
  );
}

export function SkeletonKpi() {
  return (
    <div aria-hidden className="rounded-lg border border-line bg-surface p-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="size-9 rounded-lg" />
      </div>
      <Skeleton className="mt-4 h-12 w-2/3" />
      <Skeleton className="mt-3 h-3.5 w-1/2" />
    </div>
  );
}

export function SkeletonPanel({ height = 280, className = "" }: { height?: number; className?: string }) {
  return (
    <div aria-hidden className={`rounded-lg border border-line bg-surface p-6 ${className}`}>
      <div className="mb-4 flex items-center justify-between gap-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="w-full" style={{ height }} />
    </div>
  );
}

/** A page of the app before its data arrives: heading, four figures and two panels. */
export function PageSkeleton() {
  return (
    <div role="status" aria-busy="true" aria-live="polite">
      <SkeletonHeader />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <SkeletonKpi key={i} />
        ))}
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <SkeletonPanel height={320} />
        <SkeletonPanel height={320} />
      </div>
    </div>
  );
}

/** Rows of a list inside a popover or panel. */
export function SkeletonRows({ rows = 6 }: { rows?: number }) {
  return (
    <ul aria-hidden className="space-y-1 px-1 py-1">
      {Array.from({ length: rows }, (_, i) => (
        <li key={i} className="flex items-center gap-3 rounded-md px-3 py-2.5">
          <Skeleton className="size-7 shrink-0 rounded-md" />
          <Skeleton className="h-3.5 flex-1" style={{ maxWidth: `${55 + ((i * 17) % 35)}%` }} />
          <Skeleton className="h-3 w-16 shrink-0" />
        </li>
      ))}
    </ul>
  );
}
