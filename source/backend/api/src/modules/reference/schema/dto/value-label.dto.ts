import {
  IsEnum,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";

import { Satisfies } from "#/modules/common/schema/dto/validators/satisfies.ts";
import { ValueLabelKind } from "#/modules/reference/schema/enum/value-label-kind.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * A label of a value in one language and of one kind, so a value can be shown in English, Swahili and other languages, with alternative names, abbreviations and definitions. The value's own label is the default display text. (entity)
 */
export class ValueLabelDto {
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
  @MinLength(1)
  @MaxLength(300)
  label!: Name;

  @IsEnum(ValueLabelKind)
  labelKind!: ValueLabelKind;

  @IsString()
  @IsUUID()
  languageId!: Id;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.validFrom !== null)
  @IsISO8601({ strict: true })
  @Satisfies<ValueLabelDto>(
    (object) =>
      object.validFrom == null || object.validUntil == null || object.validFrom < object.validUntil,
    {
      message: "Validity Window Is Ordered",
    },
  )
  validFrom?: CalendarDate | null;

  @IsOptional()
  @ValidateIf((object) => object.validUntil !== null)
  @IsISO8601({ strict: true })
  validUntil?: CalendarDate | null;

  @IsString()
  @IsUUID()
  valueId!: Id;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
