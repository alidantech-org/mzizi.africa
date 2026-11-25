/** Which template produced which record, for which place, and whether it is only expected or has been found. */
export interface GovernanceInstances {
  contactId?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  domainId?: string | null;
  generatedAt: string;
  id: string;
  institutionId?: string | null;
  officeId?: string | null;
  positionId?: string | null;
  statusTerm: string;
  templateId: string;
  unitFeatureId?: string | null;
  updatedAt: string;
  version: number;
}
