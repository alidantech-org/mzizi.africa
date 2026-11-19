import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Measurement unit and conversion to its optional base unit; never a spatial unit. */
export interface Unit {
  baseId?: string | null;
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  offset: number;
  quantity: string;
  scale: number;
  symbol: string;
  updatedAt: string;
  version: number;
}

/** Field metadata for forms and results. */
export const UnitFields: readonly FieldMeta[] = [
  { name: "baseId", label: "Base Id", kind: "string", required: false },
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "createdAt", label: "Created At", kind: "date", required: true },
  { name: "deletedAt", label: "Deleted At", kind: "date", required: false },
  { name: "id", label: "Id", kind: "string", required: true },
  { name: "offset", label: "Offset", kind: "number", required: true },
  { name: "quantity", label: "Quantity", kind: "string", required: true },
  { name: "scale", label: "Scale", kind: "number", required: true },
  { name: "symbol", label: "Symbol", kind: "string", required: true },
  { name: "updatedAt", label: "Updated At", kind: "date", required: true },
  { name: "version", label: "Version", kind: "number", required: true },
];
