/** One speech in a sitting. */
export interface LegislatureSpeeches {
  billId?: string | null;
  countryId: string;
  createdAt: string;
  deletedAt?: string | null;
  hansardId?: string | null;
  holderId?: string | null;
  id: string;
  kindTerm: string;
  motionId?: string | null;
  page?: number | null;
  position: number;
  sittingId: string;
  updatedAt: string;
  version: number;
  wordCount?: number | null;
}
