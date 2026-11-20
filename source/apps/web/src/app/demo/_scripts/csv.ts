/** Minimal RFC 4180 CSV reader (quoted fields, escaped quotes, embedded newlines). */
import { readFileSync } from "node:fs";

export type Row = Record<string, string>;

export function readCsv(path: string): Row[] {
  const text = readFileSync(path, "utf8");
  const rows: string[][] = [];
  let field = "";
  let row: string[] = [];
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') ((field += '"'), i++);
      else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") (row.push(field), (field = ""));
    else if (ch === "\n") (row.push(field), rows.push(row), (row = []), (field = ""));
    else if (ch !== "\r") field += ch;
  }
  if (field || row.length) (row.push(field), rows.push(row));
  const [head, ...body] = rows;
  return body.filter((r) => r.length > 1).map((r) => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ""])));
}
