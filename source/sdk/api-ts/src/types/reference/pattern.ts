/** A reviewed rule for generating expected records (institutions, positions, offices, site candidates) before real ones are found. It holds no versions, bindings or dependencies; see DEC-PATTERNS-GENERATE-EXPECTED-DATA-20261119. */
export interface ReferencePattern {
  code: string;
  countryId?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  description?: string | null;
  id: string;
  kindId?: string | null;
  title: string;
  updatedAt: string;
  version: number;
}
