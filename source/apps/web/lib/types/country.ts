import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Canonical identity for a modern country; not a geographic unit or historical polity. */
export interface Country {
  callingCode?: string | null;
  code: string;
  continentId?: string | null;
  createdAt: string;
  currencyId?: string | null;
  deletedAt?: string | null;
  designationId?: string | null;
  establishedOn?: string | null;
  id: string;
  isoAlpha2?: string | null;
  isoAlpha3?: string | null;
  isoNumeric?: string | null;
  name: string;
  officialName?: string | null;
  recognitionStatusId?: string | null;
  subregionId?: string | null;
  updatedAt: string;
  version: number;
}

/** Field metadata for forms and results. */
export const CountryFields: readonly FieldMeta[] = [
  { name: "callingCode", label: "Calling Code", kind: "string", required: false },
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "continentId", label: "Continent Id", kind: "string", required: false },
  { name: "createdAt", label: "Created At", kind: "date", required: true },
  { name: "currencyId", label: "Currency Id", kind: "string", required: false },
  { name: "deletedAt", label: "Deleted At", kind: "date", required: false },
  { name: "designationId", label: "Designation Id", kind: "string", required: false },
  { name: "establishedOn", label: "Established On", kind: "date", required: false },
  { name: "id", label: "Id", kind: "string", required: true },
  { name: "isoAlpha2", label: "Iso Alpha2", kind: "string", required: false },
  { name: "isoAlpha3", label: "Iso Alpha3", kind: "string", required: false },
  { name: "isoNumeric", label: "Iso Numeric", kind: "string", required: false },
  { name: "name", label: "Name", kind: "string", required: true },
  { name: "officialName", label: "Official Name", kind: "string", required: false },
  { name: "recognitionStatusId", label: "Recognition Status Id", kind: "string", required: false },
  { name: "subregionId", label: "Subregion Id", kind: "string", required: false },
  { name: "updatedAt", label: "Updated At", kind: "date", required: true },
  { name: "version", label: "Version", kind: "number", required: true },
];
