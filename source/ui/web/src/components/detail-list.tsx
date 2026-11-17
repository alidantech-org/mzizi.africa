/** Labelled values of one record, in the order given. A missing value is shown as such, never as blank. */
export interface DetailEntry {
  readonly label: string;
  readonly value: string | null;
}

export interface DetailListProps {
  readonly entries: readonly DetailEntry[];
  readonly missingText: string;
}

export function DetailList({ entries, missingText }: DetailListProps) {
  return (
    <dl className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-2 text-sm text-content-primary">
      {entries.map((entry) => (
        <div key={entry.label} className="contents">
          <dt className="font-medium">{entry.label}</dt>
          <dd>{entry.value ?? missingText}</dd>
        </div>
      ))}
    </dl>
  );
}
