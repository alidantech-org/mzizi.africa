import {
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  ValidateIf,
} from "class-validator";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";
import type { NonEmptyString1000 } from "#/modules/shared/schema/type/non-empty-string1000.type.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/**
 * Search Hit
 */
export class SearchHitDto {
  @IsOptional()
  @ValidateIf((object) => object.code !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  code?: Name | null;

  @IsOptional()
  @ValidateIf((object) => object.featureId !== null)
  @IsString()
  @IsUUID()
  featureId?: Id | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.imageUrl !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  imageUrl?: NonEmptyString1000 | null;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  kind!: NonEmptyString100;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  kindLabel!: NonEmptyString100;

  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(300, { each: true })
  path!: Name[];

  @IsOptional()
  @ValidateIf((object) => object.subtitle !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  subtitle?: NonEmptyString500 | null;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  title!: Name;
}
