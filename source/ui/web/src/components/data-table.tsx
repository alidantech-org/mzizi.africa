/** A table of rows with the given columns. A row can be opened; an empty list says so instead of showing nothing. */
import type { ColumnSpec } from "#ui/lib/types.ts";

export interface DataTableProps<Row extends object> {
  readonly columns: readonly ColumnSpec[];
  readonly rows: readonly Row[];
  readonly rowKey: (row: Row, index: number) => string;
  readonly cell: (row: Row, key: string) => string;
  readonly onOpen?: (row: Row) => void;
  readonly emptyText: string;
}

export function DataTable<Row extends object>({
  columns,
  rows,
  rowKey,
  cell,
  onOpen,
  emptyText,
}: DataTableProps<Row>) {
  if (rows.length === 0) return <p className="text-sm text-content-primary">{emptyText}</p>;
  return (
    <table className="w-full border-collapse text-left text-sm text-content-primary">
      <thead>
        <tr className="border-b border-border-default">
          {columns.map((column) => (
            <th key={column.key} className="px-3 py-2 font-medium">
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr
            key={rowKey(row, index)}
            onClick={onOpen === undefined ? undefined : () => onOpen(row)}
            className={
              onOpen === undefined
                ? "border-b border-border-default"
                : "cursor-pointer border-b border-border-default hover:bg-surface-background"
            }
          >
            {columns.map((column) => (
              <td key={column.key} className="px-3 py-2">
                {cell(row, column.key)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
