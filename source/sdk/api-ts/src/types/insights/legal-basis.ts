import type { InsightsLegalBasisItems } from "#sdk/types/insights/legal-basis-items.ts";
import type { InsightsLegalBasisSubject } from "#sdk/types/insights/legal-basis-subject.ts";

/** Legal Basis */
export interface InsightsLegalBasis {
  gaps: string[];
  items: InsightsLegalBasisItems[];
  subject: InsightsLegalBasisSubject;
}
