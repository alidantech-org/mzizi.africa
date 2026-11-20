/** Coverage Item */
export interface LedgerCoverageItem {
  checkedOn?: string | null;
  code: string;
  expectedAt?: string | null;
  level?: string | null;
  note?: string | null;
  source?: string | null;
  subject: string;
}
