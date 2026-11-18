import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";

/**
 * Class Count
 */
export class ClassCountDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  code!: NonEmptyString100;

  @IsInt()
  @Min(0)
  count!: NonNegativeInteger;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  label!: Name;

  @IsOptional()
  @ValidateIf((object) => object.parentCode !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  parentCode?: NonEmptyString100 | null;
}
