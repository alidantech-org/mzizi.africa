import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * Recurrence Rule
 */
export class RecurrenceRuleDto {
  @IsOptional()
  @ValidateIf((object) => object.dayOfMonth !== null)
  @IsInt()
  @Min(1)
  dayOfMonth?: PositiveInteger | null;

  @IsOptional()
  @ValidateIf((object) => object.intervalYears !== null)
  @IsInt()
  @Min(1)
  intervalYears?: PositiveInteger | null;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  kindCode!: NonEmptyString100;

  @IsOptional()
  @ValidateIf((object) => object.month !== null)
  @IsInt()
  @Min(1)
  month?: PositiveInteger | null;

  @IsOptional()
  @ValidateIf((object) => object.nthWeekday !== null)
  @IsInt()
  @Min(1)
  nthWeekday?: PositiveInteger | null;

  @IsOptional()
  @ValidateIf((object) => object.rrule !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  rrule?: NonEmptyString500 | null;

  @IsOptional()
  @ValidateIf((object) => object.weekday !== null)
  @IsInt()
  @Min(1)
  weekday?: PositiveInteger | null;
}
