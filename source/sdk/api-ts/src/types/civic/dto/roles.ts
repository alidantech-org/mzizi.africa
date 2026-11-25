/** The people and organisations involved in procurement, contracts and projects, and how. */
export interface CivicRoles {
  actedOn?: string | null;
  bidId?: string | null;
  contractId?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  holderId?: string | null;
  id: string;
  identityId?: string | null;
  procurementId?: string | null;
  projectId?: string | null;
  roleTerm: string;
  share?: number | null;
  updatedAt: string;
  version: number;
}
