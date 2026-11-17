import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { SortDirection } from "#/lib/types/sort-direction.enum.ts";

/** Base Query */
export interface BaseQuery {
  limit?: number;
  order?: SortDirection;
  page?: number;
  sort?: string;
}

/** Field metadata for forms and results. */
export const BaseQueryFields: readonly FieldMeta[] = [
  { name: "limit", label: "Limit", kind: "number", required: false },
  {
    name: "order",
    label: "Order",
    kind: "enum",
    required: false,
    options: Object.values(SortDirection),
  },
  { name: "page", label: "Page", kind: "number", required: false },
  { name: "sort", label: "Sort", kind: "string", required: false },
];
