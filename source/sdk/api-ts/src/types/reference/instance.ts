/** The ledger of generated records: which template produced which institution, position, office, site or contact, for which unit, and whether it is still only expected or has been sourced or verified. */
export interface ReferenceInstance {
  contactId?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  domainId?: string | null;
  generatedAt: string;
  id: string;
  institutionId?: string | null;
  officeId?: string | null;
  positionId?: string | null;
  statusId: string;
  templateId: string;
  unitFeatureId?: string | null;
  updatedAt: string;
  verifiedCitationId?: string | null;
  version: number;
}
