import type { HexColor } from "#/modules/explorer/schema/type/hex-color.type.ts";
import type { Share } from "#/modules/explorer/schema/type/share.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";

/** Flag Color */
export interface FlagColor {
  hex: HexColor;
  label: Name;
  share: Share;
}
