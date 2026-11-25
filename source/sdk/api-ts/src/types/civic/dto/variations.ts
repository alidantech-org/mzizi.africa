/** A change to a contract's price, period or scope. */
export interface CivicVariations {
  amountChange?: number | null;
  code: string;
  contractId: string;
  createdAt: string;
  currencyId?: string | null;
  deletedAt?: string | null;
  id: string;
  kindTerm: string;
  newEndOn?: string | null;
  note?: string | null;
  noteLanguageId?: string | null;
  signedOn?: string | null;
  updatedAt: string;
  version: number;
}
