import { Type } from "class-transformer";
import {
  IsArray,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { CountdownMilestoneDto } from "#/modules/experience/schema/dto/countdown-milestone.dto.ts";
import { RecurrenceRuleDto } from "#/modules/experience/schema/dto/recurrence-rule.dto.ts";
import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/**
 * Countdown
 */
export class CountdownDto {
  @IsInt()
  daysAway!: Integer;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  eventCode!: NonEmptyString255;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  knowledgeCode!: NonEmptyString100;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  knowledgeLabel!: Name;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => CountdownMilestoneDto)
  milestones!: CountdownMilestoneDto[];

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  name!: Name;

  @IsISO8601({ strict: true })
  plannedOn!: CalendarDate;

  @IsOptional()
  @ValidateIf((object) => object.rule !== null)
  @ValidateNested()
  @Type(() => RecurrenceRuleDto)
  rule?: RecurrenceRuleDto | null;
}
