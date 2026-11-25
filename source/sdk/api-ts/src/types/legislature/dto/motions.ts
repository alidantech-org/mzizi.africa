/** A motion debated at a sitting. */
export interface LegislatureMotions {
  billId?: string | null;
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  instrumentId?: string | null;
  kindTerm: string;
  moverId?: string | null;
  outcomeTerm?: string | null;
  periodId?: string | null;
  provisionId?: string | null;
  revisionId?: string | null;
  sittingId: string;
  updatedAt: string;
  version: number;
}
