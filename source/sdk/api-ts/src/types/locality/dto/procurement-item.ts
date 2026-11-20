import type { LocalityEvidenceRef } from "#sdk/types/locality/dto/evidence-ref.ts";

/** Procurement Item */
export interface LocalityProcurementItem {
  amount?: number | null;
  awardedTo?: string | null;
  currency?: string | null;
  evidence: LocalityEvidenceRef[];
  procurementId: string;
  status?: string | null;
  title: string;
  year?: number | null;
}
