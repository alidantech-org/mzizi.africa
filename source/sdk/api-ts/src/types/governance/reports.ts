/** One expected or found filing under an obligation, for one reporter and period, with its status and the document when found. Absence is a status, not a missing row. */
export interface GovernanceReports {
  artifactId?: string | null;
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  dueOn?: string | null;
  filedOn?: string | null;
  id: string;
  obligationId: string;
  periodFrom?: string | null;
  periodUntil?: string | null;
  reporterEntityId: string;
  sourceCitationId?: string | null;
  statusId: string;
  updatedAt: string;
  version: number;
}
