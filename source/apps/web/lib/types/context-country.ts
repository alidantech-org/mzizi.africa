import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Context Country */
export interface ContextCountry {
  code: string;
  currencyCode?: string | null;
  defaultLanguageCode?: string | null;
  isServed: boolean;
  isoCode?: string | null;
  name: string;
  subdomain?: string | null;
}

/** Field metadata for forms and results. */
export const ContextCountryFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "currencyCode", label: "Currency Code", kind: "string", required: false },
  { name: "defaultLanguageCode", label: "Default Language Code", kind: "string", required: false },
  { name: "isServed", label: "Is Served", kind: "boolean", required: true },
  { name: "isoCode", label: "Iso Code", kind: "string", required: false },
  { name: "name", label: "Name", kind: "string", required: true },
  { name: "subdomain", label: "Subdomain", kind: "string", required: false },
];
