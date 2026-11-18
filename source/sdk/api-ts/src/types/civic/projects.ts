/** One public development or infrastructure project with responsible institution, status, geographic scope and evidence. */
export interface CivicProjects {
  code: string;
  completedOn?: string | null;
  countryId?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  description: string;
  id: string;
  implementingEntityId?: string | null;
  location?: unknown | null;
  name: string;
  responsibleInstitutionId?: string | null;
  scopeUnitFeatureId?: string | null;
  sourceCitationId?: string | null;
  sponsorEntityId?: string | null;
  startedOn?: string | null;
  statusId: string;
  updatedAt: string;
  version: number;
}
