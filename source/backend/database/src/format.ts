/** Formats generated SQL so snapshots are readable and diffs are stable. Whitespace and keyword case only. */
import { readFileSync, writeFileSync } from "node:fs";
import { format } from "sql-formatter";

export function formatSql(sql: string): string {
  const formatted = format(sql, {
    language: "postgresql",
    keywordCase: "upper",
    dataTypeCase: "preserve",
    identifierCase: "preserve",
    functionCase: "preserve",
    tabWidth: 4,
    linesBetweenQueries: 1,
  });
  return `${formatted.trimEnd()}\n`;
}

export interface FormatResult {
  readonly path: string;
  readonly changed: boolean;
}

/** Formats a file in place, or only reports whether it would change when `check` is true. */
export function formatFile(path: string, check = false): FormatResult {
  const original = readFileSync(path, "utf8");
  const formatted = formatSql(original);
  const changed = formatted !== original;
  if (changed && !check) writeFileSync(path, formatted);
  return { path, changed };
}
