import { IsNumber, IsString } from "class-validator";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Election Detail Totals
 */
export class ElectionDetailTotalsDto {
  @IsString()
  name!: String;

  @IsString()
  party!: String;

  @IsString()
  partyCode!: String;

  @IsNumber({})
  share!: Number;

  @IsNumber({})
  votes!: Number;
}
