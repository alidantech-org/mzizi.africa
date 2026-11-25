/** One item of a sitting's order paper. */
export interface LegislatureAgenda {
  billId?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  kindTerm: string;
  motionId?: string | null;
  position: number;
  sittingId: string;
  updatedAt: string;
  version: number;
}
