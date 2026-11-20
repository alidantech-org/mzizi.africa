import type { InsightsLegalBasisItems } from "#sdk/types/insights/dto/legal-basis-items.ts";
import type { InsightsLegalBasisSubject } from "#sdk/types/insights/dto/legal-basis-subject.ts";

/** Legal Basis */
export interface InsightsLegalBasis {
  gaps: string[];
  items: InsightsLegalBasisItems[];
  subject: InsightsLegalBasisSubject;
}
