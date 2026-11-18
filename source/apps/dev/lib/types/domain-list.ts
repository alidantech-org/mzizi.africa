import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type DomainInfo } from "#/lib/types/domain-info.ts";

/** Domain List */
export interface DomainList {
  domains: DomainInfo[];
}

/** Field metadata for forms and results. */
export const DomainListFields: readonly FieldMeta[] = [
  { name: "domains", label: "Domains", kind: "other", required: true },
];
