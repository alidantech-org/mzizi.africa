import {
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateIf,
} from "class-validator";

import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * An edge in a geographic transformation; multiple rows sharing transformation_id represent splits, mergers, creation or dissolution without overwriting predecessor identities. (entity)
 */
export class ChangesDto {
  @IsString()
  @IsUUID()
  changeKindId!: Id;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsOptional()
  @ValidateIf((object) => object.effectiveOn !== null)
  @IsISO8601({ strict: true })
  effectiveOn?: CalendarDate | null;

  @IsOptional()
  @ValidateIf((object) => object.explanation !== null)
  @IsString()
  @MaxLength(4000)
  explanation?: Description | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.predecessorFeatureId !== null)
  @IsString()
  @IsUUID()
  predecessorFeatureId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.sourceId !== null)
  @IsString()
  @IsUUID()
  sourceId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.successorFeatureId !== null)
  @IsString()
  @IsUUID()
  successorFeatureId?: Id | null;

  @IsString()
  @IsUUID()
  transformationId!: Id;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
