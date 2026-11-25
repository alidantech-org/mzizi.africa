import type { ReferenceUnitEntryNames } from "#sdk/types/reference/dto/unit-entry-names.ts";

/** Unit Entry */
export interface ReferenceUnitEntry {
  baseId: string | null;
  code: string;
  names: ReferenceUnitEntryNames[];
  quantityTerm: string;
  symbol: string;
  unitId: string;
}
