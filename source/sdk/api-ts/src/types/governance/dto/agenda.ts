/** One item of a sitting's order paper, in order, with the bill or motion it is about. */
export interface GovernanceAgenda {
  agendaKindId: string;
  billId?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  motionId?: string | null;
  position: number;
  sittingId: string;
  sourceCitationId?: string | null;
  title: string;
  updatedAt: string;
  version: number;
}
