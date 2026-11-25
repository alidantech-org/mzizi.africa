/** Appropriation Entry */
export interface FinanceAppropriationEntry {
  amount: number | null;
  appropriationId: string;
  classTerm: string;
  code: string;
  currencyCode: string | null;
  featureId: string | null;
  parentId: string | null;
  projectId: string | null;
  recipientId: string | null;
}
