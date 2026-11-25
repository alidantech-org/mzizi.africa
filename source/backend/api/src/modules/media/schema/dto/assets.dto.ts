import {
  IsEnum,
  IsInt,
  IsISO8601,
  IsNumber,
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
import { AssetKind } from "#/modules/media/schema/enum/asset-kind.enum.ts";
import { Availability } from "#/modules/media/schema/enum/availability.enum.ts";
import type { Pixels } from "#/modules/media/schema/type/pixels.type.ts";
import type { Seconds } from "#/modules/media/schema/type/seconds.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Url } from "#/modules/shared/schema/type/url.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * A photo, logo, flag, video, audio or scan: held bytes or an external link or embed. (entity)
 */
export class AssetsDto {
  @IsOptional()
  @ValidateIf((object) => object.author !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  author?: NonEmptyString255 | null;

  @IsOptional()
  @ValidateIf((object) => object.availability !== null)
  @IsEnum(Availability)
  availability?: Availability | null;

  @IsOptional()
  @ValidateIf((object) => object.capturedOn !== null)
  @IsISO8601({ strict: true })
  capturedOn?: CalendarDate | null;

  @IsOptional()
  @ValidateIf((object) => object.checkedAt !== null)
  @IsISO8601({})
  checkedAt?: Instant | null;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  code!: IdentityCode;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsOptional()
  @ValidateIf((object) => object.duration !== null)
  @IsNumber({})
  @Min(0)
  duration?: Seconds | null;

  @IsOptional()
  @ValidateIf((object) => object.embedUrl !== null)
  @IsString()
  @IsUrl()
  @MaxLength(2048)
  embedUrl?: Url | null;

  @IsOptional()
  @ValidateIf((object) => object.endSecond !== null)
  @IsNumber({})
  @Min(0)
  endSecond?: Seconds | null;

  @IsOptional()
  @ValidateIf((object) => object.externalId !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  externalId?: NonEmptyString255 | null;

  @IsOptional()
  @ValidateIf((object) => object.externalUrl !== null)
  @IsString()
  @IsUrl()
  @MaxLength(2048)
  externalUrl?: Url | null;

  @IsOptional()
  @ValidateIf((object) => object.height !== null)
  @IsInt()
  @Min(1)
  height?: Pixels | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsEnum(AssetKind)
  @Satisfies<AssetsDto>((object) => object.kind !== "held" || object.versionId != null, {
    message: "Held Asset Has Bytes",
  })
  @Satisfies<AssetsDto>((object) => object.kind === "held" || object.externalUrl != null, {
    message: "External Asset Has Url",
  })
  kind!: AssetKind;

  @IsString()
  @IsUUID()
  kindTerm!: Id;

  @IsOptional()
  @ValidateIf((object) => object.licenceTerm !== null)
  @IsString()
  @IsUUID()
  licenceTerm?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.providerTerm !== null)
  @IsString()
  @IsUUID()
  providerTerm?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.publishedOn !== null)
  @IsISO8601({ strict: true })
  publishedOn?: CalendarDate | null;

  @IsOptional()
  @ValidateIf((object) => object.startSecond !== null)
  @IsNumber({})
  @Min(0)
  @Satisfies<AssetsDto>(
    (object) =>
      object.startSecond == null ||
      object.endSecond == null ||
      object.startSecond < object.endSecond,
    {
      message: "Asset Seconds Are Ordered",
    },
  )
  startSecond?: Seconds | null;

  @IsOptional()
  @ValidateIf((object) => object.thumbnailUrl !== null)
  @IsString()
  @IsUrl()
  @MaxLength(2048)
  thumbnailUrl?: Url | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;

  @IsOptional()
  @ValidateIf((object) => object.versionId !== null)
  @IsString()
  @IsUUID()
  versionId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.width !== null)
  @IsInt()
  @Min(1)
  width?: Pixels | null;
}
