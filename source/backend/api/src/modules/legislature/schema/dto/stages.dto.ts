import { IsInt, IsISO8601, IsOptional, IsString, IsUUID, Min, ValidateIf } from "class-validator";

import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * A stage a bill passes through. (entity)
 */
export class StagesDto {
  @IsString()
  @IsUUID()
  billId!: Id;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @IsUUID()
  kindTerm!: Id;

  @IsOptional()
  @ValidateIf((object) => object.motionId !== null)
  @IsString()
  @IsUUID()
  motionId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.onDate !== null)
  @IsISO8601({ strict: true })
  onDate?: CalendarDate | null;

  @IsOptional()
  @ValidateIf((object) => object.outcomeTerm !== null)
  @IsString()
  @IsUUID()
  outcomeTerm?: Id | null;

  @IsInt()
  @Min(1)
  sequence!: PositiveInteger;

  @IsOptional()
  @ValidateIf((object) => object.sittingId !== null)
  @IsString()
  @IsUUID()
  sittingId?: Id | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
