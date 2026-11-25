import { IsInt, IsISO8601, IsString, IsUUID, Min, ValidateIf } from "class-validator";
import type { AmountMinorUnits } from "#/modules/shared/schema/type/amount-minor-units.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/**
 * Tender Detail Bids
 */
export class TenderDetailBidsDto {
  @ValidateIf((object) => object.amount !== null)
  @IsInt()
  @Min(0)
  amount!: AmountMinorUnits | null;

  @IsString()
  @IsUUID()
  bidderId!: Id;

  @IsString()
  @IsUUID()
  outcomeTerm!: Id;

  @ValidateIf((object) => object.submittedOn !== null)
  @IsISO8601({ strict: true })
  submittedOn!: CalendarDate | null;
}
