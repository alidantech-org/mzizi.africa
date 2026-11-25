import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";

/** Release Window */
export interface ReleaseWindow {
  limit?: Integer;
  offset?: Integer;
}
