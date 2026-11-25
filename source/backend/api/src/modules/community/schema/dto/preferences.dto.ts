import {
  IsEnum,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateIf,
} from "class-validator";

import { ThemeChoice } from "#/modules/community/schema/enum/theme-choice.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * An actor's saved country, language, theme and home place. (entity)
 */
export class PreferencesDto {
  @IsString()
  @IsUUID()
  actorId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.countryId !== null)
  @IsString()
  @IsUUID()
  countryId?: Id | null;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsOptional()
  @ValidateIf((object) => object.homeFeatureId !== null)
  @IsString()
  @IsUUID()
  homeFeatureId?: Id | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.languageId !== null)
  @IsString()
  @IsUUID()
  languageId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.theme !== null)
  @IsEnum(ThemeChoice)
  theme?: ThemeChoice | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
