import { IsInt, IsISO8601, IsString, IsUUID, Min, ValidateIf } from "class-validator";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/**
 * Bill Detail Stages
 */
export class BillDetailStagesDto {
  @IsString()
  @IsUUID()
  kindTerm!: Id;

  @ValidateIf((object) => object.motionId !== null)
  @IsString()
  @IsUUID()
  motionId!: Id | null;

  @ValidateIf((object) => object.occurrenceId !== null)
  @IsString()
  @IsUUID()
  occurrenceId!: Id | null;

  @ValidateIf((object) => object.onDate !== null)
  @IsISO8601({ strict: true })
  onDate!: CalendarDate | null;

  @ValidateIf((object) => object.outcomeTerm !== null)
  @IsString()
  @IsUUID()
  outcomeTerm!: Id | null;

  @IsInt()
  @Min(1)
  sequence!: PositiveInteger;

  @ValidateIf((object) => object.sittingId !== null)
  @IsString()
  @IsUUID()
  sittingId!: Id | null;
}
