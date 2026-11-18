/** Canonical identity for a modern country; not a geographic unit or historical polity. */
export interface ReferenceCountry {
  callingCode?: string | null;
  code: string;
  continentId?: string | null;
  createdAt: string;
  currencyId?: string | null;
  defaultLanguageId?: string | null;
  deletedAt?: string | null;
  designationId?: string | null;
  establishedOn?: string | null;
  id: string;
  isServed: boolean;
  isoAlpha2?: string | null;
  isoAlpha3?: string | null;
  isoNumeric?: string | null;
  name: string;
  officialName?: string | null;
  recognitionStatusId?: string | null;
  subdomain?: string | null;
  subregionId?: string | null;
  updatedAt: string;
  version: number;
}
