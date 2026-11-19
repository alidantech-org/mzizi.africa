import { IsNumber } from "class-validator";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";

/**
 * Tender List Summary Transparency
 */
export class TenderListSummaryTransparencyDto {
  @IsNumber({})
  listed!: Number;

  @IsNumber({})
  withContract!: Number;
}
