import { IsNumber, IsString } from "class-validator";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Project Detail Procurement Bids
 */
export class ProjectDetailProcurementBidsDto {
  @IsNumber({})
  amount!: Number;

  @IsString()
  bidder!: String;

  @IsString()
  outcome!: String;
}
