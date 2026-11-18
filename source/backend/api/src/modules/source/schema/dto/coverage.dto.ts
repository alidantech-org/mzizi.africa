import {
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Matches,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";

import { Satisfies } from "#/modules/common/schema/dto/validators/satisfies.ts";
import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Url } from "#/modules/shared/schema/type/url.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * What a source or product covers, for which place, years and kind of record, how completely, and when that was checked. It makes every 'none recorded' honest: the page says which sources were checked, and a gap is never read as zero. (entity)
 */
export class CoverageDto {
  @IsISO8601({ strict: true })
  checkedOn!: CalendarDate;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  code!: IdentityCode;

  @IsString()
  @IsUUID()
  countryId!: Id;

  @IsString()
  @IsUUID()
  coverageSubjectId!: Id;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsOptional()
  @ValidateIf((object) => object.expectedPublicationUrl !== null)
  @IsString()
  @IsUrl()
  @MaxLength(2048)
  expectedPublicationUrl?: Url | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @IsUUID()
  levelId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.note !== null)
  @IsString()
  @MaxLength(4000)
  note?: Description | null;

  @IsOptional()
  @ValidateIf((object) => object.periodFrom !== null)
  @IsISO8601({ strict: true })
  @Satisfies<CoverageDto>(
    (object) =>
      object.periodFrom == null ||
      object.periodUntil == null ||
      object.periodFrom <= object.periodUntil,
    {
      message: "Coverage Period Is Ordered",
    },
  )
  periodFrom?: CalendarDate | null;

  @IsOptional()
  @ValidateIf((object) => object.periodUntil !== null)
  @IsISO8601({ strict: true })
  periodUntil?: CalendarDate | null;

  @IsOptional()
  @ValidateIf((object) => object.productId !== null)
  @IsString()
  @IsUUID()
  productId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.publisherEntityId !== null)
  @IsString()
  @IsUUID()
  publisherEntityId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.scopeUnitFeatureId !== null)
  @IsString()
  @IsUUID()
  scopeUnitFeatureId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.sourceId !== null)
  @IsString()
  @IsUUID()
  @Satisfies<CoverageDto>((object) => object.sourceId != null || object.productId != null, {
    message: "Source Or Product Named",
  })
  sourceId?: Id | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
