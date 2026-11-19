import { IsNumber, IsString } from "class-validator";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Election Detail Contests
 */
export class ElectionDetailContestsDto {
  @IsNumber({})
  contests!: Number;

  @IsString()
  kind!: String;
}
