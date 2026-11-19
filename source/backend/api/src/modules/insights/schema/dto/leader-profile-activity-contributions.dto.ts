import { IsNumber } from "class-validator";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";

/**
 * Leader Profile Activity Contributions
 */
export class LeaderProfileActivityContributionsDto {
  @IsNumber({})
  count!: Number;

  @IsNumber({})
  words!: Number;
}
