import type { SiteStatus } from "#/modules/product/schema/enum/site-status.enum.ts";
import type { Host } from "#/modules/product/schema/type/host.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";

/** Site Detail */
export interface SiteDetail {
  appCode: IdentityCode;
  code: IdentityCode;
  countryCode: IdentityCode | null;
  countryId: Id | null;
  host: Host;
  localeId: Id | null;
  siteId: Id;
  status: SiteStatus;
}
