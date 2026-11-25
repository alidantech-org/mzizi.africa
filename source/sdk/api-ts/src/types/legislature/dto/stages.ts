/** A stage a bill passes through. */
export interface LegislatureStages {
  billId: string;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  kindTerm: string;
  motionId?: string | null;
  onDate?: string | null;
  outcomeTerm?: string | null;
  sequence: number;
  sittingId?: string | null;
  updatedAt: string;
  version: number;
}
