import { IsNumber, IsString } from "class-validator";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Motion List Motions
 */
export class MotionListMotionsDto {
  @IsNumber({})
  absent!: Number;

  @IsNumber({})
  abstain!: Number;

  @IsString()
  code!: String;

  @IsString()
  heldOn!: String;

  @IsString()
  institution!: String;

  @IsString()
  institutionId!: String;

  @IsString()
  kind!: String;

  @IsNumber({})
  no!: Number;

  @IsString()
  outcome!: String;

  @IsString()
  summary!: String;

  @IsString()
  title!: String;

  @IsNumber({})
  yes!: Number;
}
