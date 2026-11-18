/** One executed contract with a contractor, optional procurement/project links and contracted amount. */
export interface CivicContracts {
  amountMinorUnits: number;
  code: string;
  contractorEntityId: string;
  createdAt: string;
  currencyId: string;
  deletedAt?: string | null;
  id: string;
  natureId?: string | null;
  procurementId?: string | null;
  projectId?: string | null;
  signedOn?: string | null;
  sourceCitationId?: string | null;
  statusId: string;
  updatedAt: string;
  version: number;
}
