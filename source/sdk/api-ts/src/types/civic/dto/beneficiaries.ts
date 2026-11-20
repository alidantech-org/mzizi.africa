import { SharedSubjectTable } from "#sdk/types/shared/enums/subject-table.ts";

/** Who or what benefits from one project, procurement or contract: a facility, a place, an organisation or a population group, with the kind of benefit. The buyer and the supplier are not beneficiaries; they are separate roles. */
export interface CivicBeneficiaries {
  benefitKindId: string;
  code: string;
  contractId?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  procurementId?: string | null;
  projectId?: string | null;
  sharePercent?: number | null;
  sourceCitationId?: string | null;
  subjectId: string;
  subjectTable: SharedSubjectTable;
  updatedAt: string;
  version: number;
}
