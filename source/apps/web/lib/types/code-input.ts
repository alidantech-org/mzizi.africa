import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Code Input */
export interface CodeInput {
  code: string;
}

/** Field metadata for forms and results. */
export const CodeInputFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
];
