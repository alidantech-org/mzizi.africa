import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";

/**
 * Place Child
 */
export class PlaceChildDto {
  @IsInt()
  @Min(0)
  childCount!: NonNegativeInteger;

  @IsString()
  @IsUUID()
  featureId!: Id;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  kindCode!: IdentityCode;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  kindLabel!: Name;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  name!: Name;

  @IsOptional()
  @ValidateIf((object) => object.path !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  path?: NonEmptyString500 | null;

  @IsOptional()
  @ValidateIf((object) => object.population !== null)
  @IsNumber({})
  population?: Number | null;
}
