/** Horizontal bars for shares of a whole: a label, a bar and the share. Plain HTML, no script. */
export function ShareBars({
  rows,
  format,
  label,
}: {
  rows: { label: string; share: number }[];
  /** Writes a share (0 to 1) as text in the reader's language. */
  format: (share: number) => string;
  label: string;
}) {
  const max = Math.max(...rows.map((r) => r.share), 0.0001);
  return (
    <ul role="img" aria-label={label} className="space-y-2.5 text-sm">
      {rows.map((r) => (
        <li key={r.label} className="grid grid-cols-[minmax(0,6rem)_1fr_3rem] items-center gap-2 sm:grid-cols-[minmax(0,9rem)_1fr_3.5rem] sm:gap-3">
          <span className="truncate">{r.label}</span>
          <span className="h-2.5 overflow-hidden rounded-full bg-line">
            <span className="block h-full rounded-full bg-c1" style={{ width: `${Math.max(2, (r.share / max) * 100)}%` }} />
          </span>
          <span className="text-right font-mono text-xs text-muted">{format(r.share)}</span>
        </li>
      ))}
    </ul>
  );
}
