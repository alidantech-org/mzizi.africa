/** A person in an office for a period. How they got there is `governance.appointments`. */
export interface GovernanceHolders {
  code: string;
  contestId?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  endsOn?: string | null;
  fromYear?: number | null;
  id: string;
  individualId: string;
  methodTerm: string;
  officeId: string;
  reasonTerm?: string | null;
  startsOn?: string | null;
  toYear?: number | null;
  updatedAt: string;
  version: number;
}
