import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { InstitutionDetailChildren } from "#/modules/insights/schema/interface/institution-detail-children.interface.ts";
import type { InstitutionDetailContent } from "#/modules/insights/schema/interface/institution-detail-content.interface.ts";
import type { InstitutionDetailInstitution } from "#/modules/insights/schema/interface/institution-detail-institution.interface.ts";
import type { InstitutionDetailLeaders } from "#/modules/insights/schema/interface/institution-detail-leaders.interface.ts";
import type { InstitutionDetailLegalBasis } from "#/modules/insights/schema/interface/institution-detail-legal-basis.interface.ts";
import type { InstitutionDetailMetrics } from "#/modules/insights/schema/interface/institution-detail-metrics.interface.ts";
import type { InstitutionDetailParents } from "#/modules/insights/schema/interface/institution-detail-parents.interface.ts";

/** Institution Detail */
export interface InstitutionDetail {
  children: InstitutionDetailChildren[];
  content: InstitutionDetailContent[];
  gaps: NonEmptyString500[];
  institution: InstitutionDetailInstitution;
  leaders: InstitutionDetailLeaders[];
  legalBasis: InstitutionDetailLegalBasis[];
  metrics: InstitutionDetailMetrics[];
  parents: InstitutionDetailParents[];
}
