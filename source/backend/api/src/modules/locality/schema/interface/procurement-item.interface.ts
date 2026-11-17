import type { Amount } from "#/modules/locality/schema/type/amount.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";
import type { EvidenceRef } from "#/modules/locality/schema/interface/evidence-ref.interface.ts";

/** Procurement Item */
export interface ProcurementItem {
  amount?: Amount | null;
  awardedTo?: Name | null;
  currency?: NonEmptyString100 | null;
  evidence: EvidenceRef[];
  procurementId: Id;
  status?: NonEmptyString100 | null;
  title: Name;
  year?: Integer | null;
}
