import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { LegalBasisItems } from "#/modules/insights/schema/interface/legal-basis-items.interface.ts";
import type { LegalBasisSubject } from "#/modules/insights/schema/interface/legal-basis-subject.interface.ts";

/** Legal Basis */
export interface LegalBasis {
  gaps: NonEmptyString500[];
  items: LegalBasisItems[];
  subject: LegalBasisSubject;
}
