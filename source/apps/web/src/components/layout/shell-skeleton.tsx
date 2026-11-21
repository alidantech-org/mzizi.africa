/**
 * The frame of the app, drawn before the shell's data has loaded. It has the same structure and sizes as the real
 * sidebar and top bar, and takes the sidebar width from the value the first-paint script read from the cookie, so the
 * real shell replaces it without anything moving.
 */
import { Skeleton } from "#/components/ui/skeleton";

export function ShellSkeleton() {
  return (
    <div className="relative z-10 flex h-screen overflow-hidden bg-paper text-ink" role="status" aria-busy="true">
      <aside className="sk-aside hidden shrink-0 flex-col border-r border-line bg-surface lg:flex" style={{ width: "var(--side-w, 264px)" }}>
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-line px-3">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="size-8" />
        </div>
        <div className="min-h-0 flex-1 space-y-2 p-2">
          <Skeleton className="h-9 w-full" />
          {[3, 2, 2, 2].map((n, g) => (
            <div key={g} className="mt-4 space-y-1.5">
              <Skeleton className="mx-2 h-2.5 w-16" />
              {Array.from({ length: n }, (_, i) => (
                <Skeleton key={i} className="h-9 w-full opacity-70" />
              ))}
            </div>
          ))}
        </div>
        <div className="flex h-12 shrink-0 items-center border-t border-line px-2">
          <Skeleton className="h-9 w-full" />
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-12 shrink-0 items-center gap-2 border-b border-line bg-surface px-3">
          <Skeleton className="size-9 lg:hidden" />
          <Skeleton className="h-8 w-full max-w-[17rem]" />
          <div className="ml-auto hidden items-center gap-1.5 md:flex">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="size-9" />
            ))}
          </div>
          <Skeleton className="ml-auto size-9 md:hidden" />
        </header>
        <main className="min-h-0 flex-1 overflow-y-hidden">
          <div className="mx-auto w-full max-w-[1200px] px-4 pb-16 pt-8 md:px-8">
            <Skeleton className="h-3 w-40" />
            <Skeleton className="mt-4 h-12 w-2/3 max-w-xl" />
            <Skeleton className="mt-6 h-4 w-full max-w-2xl" />
          </div>
        </main>
      </div>
    </div>
  );
}
