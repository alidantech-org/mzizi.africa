import {
  IsBoolean,
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
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * One attested name form for exactly one entity or individual, with its language (`mul` or `und` when none applies) and validity. (entity)
 *
 * Invariant "HasExactlyOneIdentityOwner" has no simple form, so it isn't validated here.
 */
export class NamesDto {
  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsOptional()
  @ValidateIf((object) => object.entityId !== null)
  @IsString()
  @IsUUID()
  entityId?: Id | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.individualId !== null)
  @IsString()
  @IsUUID()
  individualId?: Id | null;

  @IsBoolean()
  isPreferred!: Flag;

  @IsString()
  @IsUUID()
  languageId!: Id;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  name!: Name;

  @IsString()
  @IsUUID()
  nameKindId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.sourceCitationId !== null)
  @IsString()
  @IsUUID()
  sourceCitationId?: Id | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.validFrom !== null)
  @IsISO8601({ strict: true })
  @Satisfies<NamesDto>(
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

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
