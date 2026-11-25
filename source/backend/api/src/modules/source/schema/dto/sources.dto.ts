import {
  IsEnum,
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
import { SourceKind } from "#/modules/source/schema/enum/source-kind.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Url } from "#/modules/shared/schema/type/url.type.ts";
import type { Label } from "#/modules/source/schema/type/label.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * A publication channel of a publisher. (entity)
 */
export class SourcesDto {
  @IsOptional()
  @ValidateIf((object) => object.classTerm !== null)
  @IsString()
  @IsUUID()
  classTerm?: Id | null;

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
  @ValidateIf((object) => object.credentialBinding !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  credentialBinding?: NonEmptyString255 | null;

  @IsOptional()
  @ValidateIf((object) => object.credibilityTerm !== null)
  @IsString()
  @IsUUID()
  credibilityTerm?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsEnum(SourceKind)
  kind!: SourceKind;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  label!: Label;

  @IsOptional()
  @ValidateIf((object) => object.licenceTerm !== null)
  @IsString()
  @IsUUID()
  licenceTerm?: Id | null;

  @IsString()
  @IsUUID()
  publisherId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.termsUrl !== null)
  @IsString()
  @IsUrl()
  @MaxLength(2048)
  termsUrl?: Url | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
