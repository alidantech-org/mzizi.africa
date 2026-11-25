/** A deduplicated access scope: global, or narrowed by institution, country, place or field group. */
export interface AuthScopes {
  countryId?: string | null;
  createdAt: string;
  featureId?: string | null;
  fieldGroup?: string | null;
  id: string;
  includeDescendants: boolean;
  institutionId?: string | null;
  isGlobal: boolean;
  scopeHash: string;
}
