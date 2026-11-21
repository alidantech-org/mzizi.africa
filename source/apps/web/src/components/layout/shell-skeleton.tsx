/**
 * The frame of the app, drawn before the shell's data has loaded: a sidebar, a top bar and a heading. It has the same
 * structure and outer sizes as the real shell and takes the sidebar width from the value the first-paint script read
 * from the cookie, so the real shell replaces it without anything moving.
 */
import { Skeleton } from "#/components/ui/skeleton";

export function ShellSkeleton() {
  return (
    <div className="relative z-10 flex h-screen overflow-hidden bg-paper text-ink" role="status" aria-busy="true">
      <aside className="sk-aside hidden shrink-0 border-r border-line bg-surface lg:block" style={{ width: "var(--side-w, 264px)" }}>
        <div className="flex h-12 items-center border-b border-line px-3">
          <Skeleton className="h-5 w-20" />
        </div>
        <div className="space-y-2 p-2">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-9 w-full" />
          ))}
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-12 shrink-0 items-center gap-2 border-b border-line bg-surface px-3">
          <Skeleton className="size-9 lg:hidden" />
          <Skeleton className="h-8 w-full max-w-[17rem]" />
        </header>
        <main className="min-h-0 flex-1 overflow-y-hidden">
          <div className="mx-auto w-full max-w-[1200px] px-3 pb-16 pt-8 sm:px-4 md:px-8">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="mt-4 h-10 w-2/3 max-w-md" />
          </div>
        </main>
      </div>
    </div>
  );
}
