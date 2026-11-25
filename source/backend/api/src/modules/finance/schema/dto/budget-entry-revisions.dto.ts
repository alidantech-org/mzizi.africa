import { IsInt, IsISO8601, IsString, IsUUID, Min, ValidateIf } from "class-validator";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/**
 * Budget Entry Revisions
 */
export class BudgetEntryRevisionsDto {
  @ValidateIf((object) => object.releasedOn !== null)
  @IsISO8601({ strict: true })
  releasedOn!: CalendarDate | null;

  @IsInt()
  @Min(1)
  revision!: PositiveInteger;

  @IsString()
  @IsUUID()
  revisionId!: Id;

  @IsString()
  @IsUUID()
  statusTerm!: Id;
}
