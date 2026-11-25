import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";

/** Instrument Window */
export interface InstrumentWindow {
  kindTerm?: Id;
  limit?: Integer;
  offset?: Integer;
}
