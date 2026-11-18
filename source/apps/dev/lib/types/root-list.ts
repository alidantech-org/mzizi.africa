import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type RootInfo } from "#/lib/types/root-info.ts";

/** Root List */
export interface RootList {
  roots: RootInfo[];
}

/** Field metadata for forms and results. */
export const RootListFields: readonly FieldMeta[] = [
  { name: "roots", label: "Roots", kind: "other", required: true },
];
