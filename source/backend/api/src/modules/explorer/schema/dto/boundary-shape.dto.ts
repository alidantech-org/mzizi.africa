import {
  IsArray,
  IsInt,
  IsJSON,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";
import type { Amount } from "#/modules/explorer/schema/type/amount.type.ts";
import type { Degrees } from "#/modules/explorer/schema/type/degrees.type.ts";
import type { Path } from "#/modules/explorer/schema/type/path.type.ts";
import type { JsonText } from "#/modules/shared/schema/type/json-text.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";

/**
 * Boundary Shape
 */
export class BoundaryShapeDto {
  @IsString()
  @MinLength(1)
  @MaxLength(1500)
  address!: Path;

  @IsArray()
  @IsNumber({}, { each: true })
  @Min(-180, { each: true })
  @Max(180, { each: true })
  bbox!: Degrees[];

  @IsInt()
  @Min(0)
  childCount!: NonNegativeInteger;

  @IsString()
  @IsJSON()
  geometry!: JsonText;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  kind!: Name;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  kindCode!: NonEmptyString255;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  name!: Name;

  @IsOptional()
  @ValidateIf((object) => object.population !== null)
  @IsNumber({})
  @Min(0)
  @Max(100000000000)
  population?: Amount | null;
}
