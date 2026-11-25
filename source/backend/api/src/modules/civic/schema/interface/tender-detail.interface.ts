import type { CurrencyCode } from "#/modules/reference/schema/type/currency-code.type.ts";
import type { AmountMinorUnits } from "#/modules/shared/schema/type/amount-minor-units.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";
import type { TenderDetailBids } from "#/modules/civic/schema/interface/tender-detail-bids.interface.ts";
import type { TenderDetailNames } from "#/modules/civic/schema/interface/tender-detail-names.interface.ts";

/** Tender Detail */
export interface TenderDetail {
  amount: AmountMinorUnits | null;
  bidderCount: NonNegativeInteger | null;
  bids: TenderDetailBids[];
  buyerId: Id;
  categoryTerm: Id;
  code: IdentityCode;
  currencyCode: CurrencyCode | null;
  names: TenderDetailNames[];
  procedureTerm: Id;
  procurementId: Id;
  projectId: Id | null;
  statusTerm: Id;
}
