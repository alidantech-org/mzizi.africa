import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Tag Body */
export interface TagBody {
  domain?: string;
  texts: string[];
}

/** Field metadata for forms and results. */
export const TagBodyFields: readonly FieldMeta[] = [
  { name: "domain", label: "Domain", kind: "string", required: false },
  { name: "texts", label: "Texts", kind: "string", required: true },
];
