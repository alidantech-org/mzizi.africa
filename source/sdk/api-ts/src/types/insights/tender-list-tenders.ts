/** Tender List Tenders */
export interface InsightsTenderListTenders {
  amount?: number | null;
  awardedOn?: string | null;
  bids: number;
  buyer: string;
  closesOn: string;
  code: string;
  disclosed: number;
  disclosedOf: number;
  place?: string | null;
  procedure: string;
  publishedOn: string;
  reference?: string | null;
  status: string;
  supplier?: string | null;
  title: string;
}
