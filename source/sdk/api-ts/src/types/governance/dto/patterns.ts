/** A reviewed rule for generating expected records (institutions, positions, offices, sites) before real ones are found. */
export interface GovernancePatterns {
  code: string;
  countryId?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  kindTerm?: string | null;
  title: string;
  updatedAt: string;
  version: number;
}
