import { IsNumber, IsString } from "class-validator";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Motion Detail Parties
 */
export class MotionDetailPartiesDto {
  @IsNumber({})
  absent!: Number;

  @IsNumber({})
  abstain!: Number;

  @IsNumber({})
  no!: Number;

  @IsString()
  party!: String;

  @IsNumber({})
  yes!: Number;
}
