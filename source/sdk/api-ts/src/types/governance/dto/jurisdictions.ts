/** Where an institution or office has authority. */
export interface GovernanceJurisdictions {
  code: string;
  countryId: string;
  createdAt: string;
  deletedAt?: string | null;
  featureId?: string | null;
  fromYear?: number | null;
  id: string;
  institutionId?: string | null;
  kindTerm: string;
  officeId?: string | null;
  toYear?: number | null;
  updatedAt: string;
  version: number;
}
