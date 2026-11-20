/** Budget */
export interface LedgerBudget {
  code: string;
  entity?: string | null;
  fiscalFrom?: string | null;
  fiscalTo?: string | null;
  kind: string;
  latestReleasedOn?: string | null;
  revisions: number;
}
