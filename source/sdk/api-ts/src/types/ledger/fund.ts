/** Fund */
export interface LedgerFund {
  code: string;
  featureId?: string | null;
  flows: number;
  kind: string;
  manager?: string | null;
  path?: string | null;
  place?: string | null;
  source?: string | null;
}
