import {
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
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonEmptyString1000 } from "#/modules/shared/schema/type/non-empty-string1000.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * One exact external identifier assigned to an entity or individual under a Reference scheme and optional issuer. (entity)
 *
 * Invariant "HasExactlyOneIdentityOwner" has no simple form, so it isn't validated here.
 */
export class IdentifiersDto {
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

  @IsOptional()
  @ValidateIf((object) => object.issuerEntityId !== null)
  @IsString()
  @IsUUID()
  issuerEntityId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.namespace !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  namespace?: NonEmptyString255 | null;

  @IsString()
  @IsUUID()
  schemeId!: Id;

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
  @Satisfies<IdentifiersDto>(
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
  @MinLength(1)
  @MaxLength(1000)
  value!: NonEmptyString1000;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
