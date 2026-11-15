
import {
  IsEnum,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
} from "class-validator";

import { Satisfies } from "#/modules/common/dto/validators/satisfies.ts";
import { ValueRelationKind } from "#/modules/reference/enum/value-relation-kind.enum.ts";
import type { Id } from "#/modules/shared/type/id.type.ts";
import type { CalendarDate } from "#/modules/shared/type/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/type/instant.type.ts";

/**
 * Proposed directed, typed, time-aware relation between classification values; supports multi-parent and cross-scheme taxonomy. (entity)
 */
export class ValueRelationDto {

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsEnum(ValueRelationKind)
  relationKind!: ValueRelationKind;

  @IsString()
  @IsUUID()
  @Satisfies<ValueRelationDto>((object) => object.sourceValueId !== object.targetValueId, {
    message: "Value Relation Must Not Be Self Referential",
  })
  sourceValueId!: Id;

  @IsString()
  @IsUUID()
  targetValueId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.validFrom !== null)
  @IsISO8601({ strict: true })
  @Satisfies<ValueRelationDto>((object) => object.validFrom == null || object.validUntil == null || object.validFrom < object.validUntil, {
    message: "Value Relation Window Must Be Ordered",
  })
  validFrom?: CalendarDate | null;

  @IsOptional()
  @ValidateIf((object) => object.validUntil !== null)
  @IsISO8601({ strict: true })
  validUntil?: CalendarDate | null;
}