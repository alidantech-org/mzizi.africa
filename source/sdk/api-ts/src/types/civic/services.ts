/** One provider's service provision at a physical place or geographic coverage unit during a service period. */
export interface CivicServices {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  description: string;
  endsOn?: string | null;
  id: string;
  name: string;
  placeFeatureId?: string | null;
  providerEntityId: string;
  responsibleInstitutionId?: string | null;
  scopeUnitFeatureId?: string | null;
  serviceKindId: string;
  sourceCitationId?: string | null;
  startsOn?: string | null;
  updatedAt: string;
  version: number;
}
