import {
  IsEnum,
  IsISO8601,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  ValidateIf,
} from "class-validator";
import { ReviewStatus } from "#/modules/legal/schema/enum/review-status.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/**
 * Effect Entry
 */
export class EffectEntryDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  designation!: NonEmptyString255;

  @IsString()
  @IsUUID()
  effectId!: Id;

  @ValidateIf((object) => object.effectiveOn !== null)
  @IsISO8601({ strict: true })
  effectiveOn!: CalendarDate | null;

  @IsString()
  @IsUUID()
  instrumentId!: Id;

  @IsString()
  @IsUUID()
  kindTerm!: Id;

  @IsString()
  @IsUUID()
  provisionId!: Id;

  @IsEnum(ReviewStatus)
  reviewStatus!: ReviewStatus;

  @IsString()
  @IsUUID()
  wordingId!: Id;
}
