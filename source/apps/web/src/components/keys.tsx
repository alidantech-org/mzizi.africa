/** A keyboard shortcut drawn as key caps: [ Ctrl ] + [ B ]. */
import { Fragment } from "react";

export function Keys({ keys }: { keys: string[] }) {
  return (
    <span className="inline-flex items-center gap-1" aria-label={keys.join(" plus ")}>
      {keys.map((k, i) => (
        <Fragment key={k}>
          {i > 0 && <span aria-hidden className="text-[11px] text-muted">+</span>}
          <kbd aria-hidden className="grid h-6 min-w-6 place-items-center rounded-md border border-b-2 border-line bg-paper px-1.5 font-mono text-[11px] font-medium leading-none text-ink">{k}</kbd>
        </Fragment>
      ))}
    </span>
  );
}
