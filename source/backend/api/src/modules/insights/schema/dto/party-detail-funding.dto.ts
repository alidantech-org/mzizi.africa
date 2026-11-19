import { IsNumber } from "class-validator";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";

/**
 * Party Detail Funding
 */
export class PartyDetailFundingDto {
  @IsNumber({})
  amountKes!: Number;

  @IsNumber({})
  year!: Number;
}
