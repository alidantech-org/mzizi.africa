import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type TableInfo } from "#/lib/types/table-info.ts";

/** Domain Info */
export interface DomainInfo {
  domain: string;
  tables: TableInfo[];
}

/** Field metadata for forms and results. */
export const DomainInfoFields: readonly FieldMeta[] = [
  { name: "domain", label: "Domain", kind: "string", required: true },
  { name: "tables", label: "Tables", kind: "other", required: true },
];
