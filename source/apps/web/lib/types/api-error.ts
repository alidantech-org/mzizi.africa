import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Api Error */
export interface ApiError {
  code?: string;
  message: string;
}

/** Field metadata for forms and results. */
export const ApiErrorFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: false },
  { name: "message", label: "Message", kind: "string", required: true },
];
