
import type { Id } from "#/modules/shared/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/type/identity-code.type.ts";
import type { OfficeDetailHolders } from "#/modules/governance/interface/office-detail-holders.interface.ts";

/** Office Detail */
export interface OfficeDetail {
  code: IdentityCode;
  holders: OfficeDetailHolders[];
  id: Id;
  institutionId: Id;
  kind: IdentityCode;
  unitFeatureId: Id | null;
}