import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Member Window */
export interface MemberWindow {
  limit?: number;
  offset?: number;
  schemeId: string;
}

/** Field metadata for forms and results. */
export const MemberWindowFields: readonly FieldMeta[] = [
  { name: "limit", label: "Limit", kind: "number", required: false },
  { name: "offset", label: "Offset", kind: "number", required: false },
  { name: "schemeId", label: "Scheme Id", kind: "string", required: true },
];
