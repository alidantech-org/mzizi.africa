/** A numbered term or mandate of an institution or office (absorbs the former mandates). */
export interface GovernanceOfficeTerms {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  endsOn?: string | null;
  featureId?: string | null;
  fromYear?: number | null;
  id: string;
  institutionId?: string | null;
  kindTerm: string;
  officeId?: string | null;
  ordinal?: number | null;
  startsOn?: string | null;
  toYear?: number | null;
  updatedAt: string;
  version: number;
}
