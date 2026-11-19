import { IsBoolean, IsNumber } from "class-validator";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";

/**
 * Motion Detail Tally
 */
export class MotionDetailTallyDto {
  @IsNumber({})
  absent!: Number;

  @IsNumber({})
  abstain!: Number;

  @IsNumber({})
  no!: Number;

  @IsBoolean()
  passed!: Flag;

  @IsNumber({})
  total!: Number;

  @IsNumber({})
  yes!: Number;
}
