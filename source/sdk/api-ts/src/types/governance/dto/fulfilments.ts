/** A recorded link from a promise to what delivered it, with how the link was made and whether it is reviewed. */
export interface GovernanceFulfilments {
  appropriationId?: string | null;
  billId?: string | null;
  contractId?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  evidenceStatusId: string;
  id: string;
  instrumentId?: string | null;
  kindId: string;
  projectId?: string | null;
  promiseId: string;
  recordedOn: string;
  sourceCitationId?: string | null;
  updatedAt: string;
  version: number;
}
