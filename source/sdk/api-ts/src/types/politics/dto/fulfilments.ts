/** What delivered (or contradicts) a commitment: a project, contract, appropriation, bill or law. */
export interface PoliticsFulfilments {
  appropriationId?: string | null;
  billId?: string | null;
  commitmentId: string;
  contractId?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  instrumentId?: string | null;
  kindTerm: string;
  projectId?: string | null;
  recordedOn?: string | null;
  statusTerm: string;
  updatedAt: string;
  version: number;
}
