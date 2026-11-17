import {
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
  Min,
  ValidateIf,
} from "class-validator";
import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NullableString1000 } from "#/modules/shared/schema/type/nullable-string1000.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Url } from "#/modules/shared/schema/type/url.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * An observation that an address exists: where it was found, as what text and when. Retrieval is a separate capture. (entity)
 */
export class DiscoveriesDto {
  @IsOptional()
  @ValidateIf((object) => object.addressId !== null)
  @IsString()
  @IsUUID()
  addressId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.anchorText !== null)
  @IsString()
  @MaxLength(1000)
  anchorText?: NullableString1000 | null;

  @IsOptional()
  @ValidateIf((object) => object.context !== null)
  @IsString()
  @MaxLength(4000)
  context?: Description | null;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsISO8601({})
  discoveredAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.foundOnAddressId !== null)
  @IsString()
  @IsUUID()
  foundOnAddressId?: Id | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @IsUrl()
  @MaxLength(2048)
  observedUrl!: Url;

  @IsOptional()
  @ValidateIf((object) => object.sourceId !== null)
  @IsString()
  @IsUUID()
  sourceId?: Id | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
