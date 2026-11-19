import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { Manifesto } from "#/modules/ledger/schema/interface/manifesto.interface.ts";

/** Manifesto List */
export interface ManifestoList {
  gaps: NonEmptyString500[];
  manifestos: Manifesto[];
}
