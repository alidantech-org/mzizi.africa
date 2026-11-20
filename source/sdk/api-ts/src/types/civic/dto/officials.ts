/** A person who acted in a buying process (evaluated, approved, signed), with the role and the office held then; this is what lets a conflict be checked on a real signature. */
export interface CivicOfficials {
  actedOn?: string | null;
  contractId?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  individualId: string;
  officeId?: string | null;
  procurementId?: string | null;
  roleId: string;
  sourceCitationId?: string | null;
  updatedAt: string;
  version: number;
}
