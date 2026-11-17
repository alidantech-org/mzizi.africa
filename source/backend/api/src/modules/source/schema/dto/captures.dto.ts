import {
  IsInt,
  IsISO8601,
  IsJSON,
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
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { JsonText } from "#/modules/shared/schema/type/json-text.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Url } from "#/modules/shared/schema/type/url.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * One retrieval of an address: when, from which link, with what response. Repeated captures never overwrite each other. (entity)
 */
export class CapturesDto {
  @IsOptional()
  @ValidateIf((object) => object.addressId !== null)
  @IsString()
  @IsUUID()
  addressId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.artifactId !== null)
  @IsString()
  @IsUUID()
  artifactId?: Id | null;

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
  @ValidateIf((object) => object.discoveryId !== null)
  @IsString()
  @IsUUID()
  discoveryId?: Id | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @IsUrl()
  @MaxLength(2048)
  originalUrl!: Url;

  @IsString()
  @IsJSON()
  responseMetadata!: JsonText;

  @IsISO8601({})
  retrievedAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.retrievedUrl !== null)
  @IsString()
  @IsUrl()
  @MaxLength(2048)
  retrievedUrl?: Url | null;

  @IsString()
  @IsUUID()
  sourceId!: Id;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
