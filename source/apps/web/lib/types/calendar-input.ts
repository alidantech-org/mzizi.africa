import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Calendar Input */
export interface CalendarInput {
  featureId?: string;
  from?: string;
  kindCode?: string;
  languageCode?: string;
  to?: string;
}

/** Field metadata for forms and results. */
export const CalendarInputFields: readonly FieldMeta[] = [
  { name: "featureId", label: "Feature Id", kind: "string", required: false },
  { name: "from", label: "From", kind: "date", required: false },
  { name: "kindCode", label: "Kind Code", kind: "string", required: false },
  { name: "languageCode", label: "Language Code", kind: "string", required: false },
  { name: "to", label: "To", kind: "date", required: false },
];
