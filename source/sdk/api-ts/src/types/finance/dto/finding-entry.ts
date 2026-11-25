/** Finding Entry */
export interface FinanceFindingEntry {
  amount: number | null;
  code: string;
  contractId: string | null;
  currencyCode: string | null;
  findingId: string;
  kindTerm: string;
  periodId: string;
  projectId: string | null;
  statusTerm: string;
}
