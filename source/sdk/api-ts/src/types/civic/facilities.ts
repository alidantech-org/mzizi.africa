/** The civic role of a geographic feature: a school, hospital, office, road, market or polling host. Size and capacity are observations on the feature; what it is and its levels are classifications; money reaches it through project links. */
export interface CivicFacilities {
  closedOn?: string | null;
  code: string;
  countryId?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  facilityClassId: string;
  featureId: string;
  id: string;
  openedOn?: string | null;
  operatorEntityId?: string | null;
  ownerEntityId?: string | null;
  ownershipId?: string | null;
  responsibleInstitutionId?: string | null;
  sourceCitationId?: string | null;
  statusId: string;
  updatedAt: string;
  version: number;
}
