import type { ReactNode } from "react";

/** Reads on the server and renders the page content, or an explanation and a retry link when the read failed. */
export async function Loaded<T>({ read, children }: { read: () => Promise<T>; children: (value: T) => ReactNode }) {
  let value: T;
  try {
    value = await read();
  } catch (error) {
    return (
      <div role="alert" className="rounded-[var(--radius)] border border-danger/40 bg-surface-elevated p-6">
        <p className="font-display text-xl text-danger">This could not be loaded</p>
        <p className="mt-2 text-sm text-content-muted">The information is not available right now. Your saved choices are still available.</p>
        <a href="" className="btn btn-primary mt-4">Try again</a>
        <details className="mt-3 text-xs text-content-muted">
          <summary className="cursor-pointer">Technical details</summary>
          <p className="mt-2 break-words">{error instanceof Error ? error.message : String(error)}</p>
        </details>
      </div>
    );
  }
  return <>{children(value)}</>;
}
