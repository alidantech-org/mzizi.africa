/** One report filed (or not) against an obligation. */
export interface GovernanceReports {
  artifactId?: string | null;
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  dueOn?: string | null;
  filedOn?: string | null;
  fromYear?: number | null;
  id: string;
  obligationId: string;
  reporterId: string;
  statusTerm: string;
  toYear?: number | null;
  updatedAt: string;
  version: number;
}
