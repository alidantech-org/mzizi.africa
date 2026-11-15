
import type { Id } from "#/modules/shared/id.type.ts";
import type { IdentityCode } from "#/modules/shared/identity-code.type.ts";
import type { OfficeDetailHolders } from "#/modules/governance/office-detail-holders.interface.ts";

/** Office Detail */
export interface OfficeDetail {
  code: IdentityCode;
  holders: OfficeDetailHolders[];
  id: Id;
  institutionId: Id;
  kind: IdentityCode;
  unitFeatureId: Id | null;
}