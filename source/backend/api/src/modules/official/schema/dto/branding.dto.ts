import {
  IsArray,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";

import { Satisfies } from "#/modules/common/schema/dto/validators/satisfies.ts";
import type { BrandText } from "#/modules/official/schema/type/brand-text.type.ts";
import type { HexColor } from "#/modules/official/schema/type/hex-color.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * Words and colours of a named thing (slogan, motto, party colours); images are `media`. (entity)
 */
export class BrandingDto {
  @IsOptional()
  @ValidateIf((object) => object.colors !== null)
  @IsArray()
  @IsString({ each: true })
  @Matches(new RegExp("^#[0-9a-fA-F]{6}$"), { each: true })
  colors?: HexColor[] | null;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsOptional()
  @ValidateIf((object) => object.fromYear !== null)
  @IsInt()
  @Min(-10000)
  @Max(3000)
  fromYear?: Year | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @IsUUID()
  identityId!: Id;

  @IsString()
  @IsUUID()
  kindTerm!: Id;

  @IsOptional()
  @ValidateIf((object) => object.languageId !== null)
  @IsString()
  @IsUUID()
  languageId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.text !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  @Satisfies<BrandingDto>((object) => object.text == null || object.languageId != null, {
    message: "Brand Text Has Language",
  })
  text?: BrandText | null;

  @IsOptional()
  @ValidateIf((object) => object.toYear !== null)
  @IsInt()
  @Min(-10000)
  @Max(3000)
  toYear?: Year | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
