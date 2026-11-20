import { IsNumber, IsString, Max, MaxLength, Min, MinLength } from "class-validator";
import type { HexColor } from "#/modules/explorer/schema/type/hex-color.type.ts";
import type { Share } from "#/modules/explorer/schema/type/share.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";

/**
 * Flag Color
 */
export class FlagColorDto {
  @IsString()
  @MinLength(7)
  @MaxLength(7)
  hex!: HexColor;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  label!: Name;

  @IsNumber({})
  @Min(0)
  @Max(1)
  share!: Share;
}
