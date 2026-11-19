import { IsNumber, IsString } from "class-validator";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Tender List Summary By Status
 */
export class TenderListSummaryByStatusDto {
  @IsNumber({})
  count!: Number;

  @IsString()
  status!: String;

  @IsNumber({})
  valueKes!: Number;
}
