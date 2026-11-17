/** Deduplicated access scope: global, or narrowed by country, geographic unit, dataset or field group. */
export interface AuthScopes {
  countryRefId?: string | null;
  createdAt: string;
  datasetRefId?: string | null;
  fieldGroup?: string | null;
  geographicUnitRefId?: string | null;
  id: string;
  includeDescendants: boolean;
  institutionRefId: string;
  isGlobal: boolean;
  scopeHash: string;
}
