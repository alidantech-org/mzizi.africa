/** An audit finding about an institution in a fiscal period. */
export interface FinanceFindings {
  amount?: number | null;
  code: string;
  contractId?: string | null;
  createdAt: string;
  currencyId?: string | null;
  deletedAt?: string | null;
  flowCountryId?: string | null;
  flowId?: string | null;
  id: string;
  institutionId: string;
  kindTerm: string;
  periodId: string;
  projectId?: string | null;
  statusTerm: string;
  updatedAt: string;
  version: number;
}
