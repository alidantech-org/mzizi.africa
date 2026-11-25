/** A signed contract. */
export interface CivicContracts {
  amount?: number | null;
  buyerId: string;
  code: string;
  contractorId: string;
  createdAt: string;
  currencyId?: string | null;
  deletedAt?: string | null;
  endsOn?: string | null;
  id: string;
  natureTerm: string;
  procurementId?: string | null;
  projectId?: string | null;
  signedOn?: string | null;
  startsOn?: string | null;
  statusTerm: string;
  updatedAt: string;
  version: number;
}
