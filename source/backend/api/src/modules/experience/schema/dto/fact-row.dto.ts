import { IsBoolean, IsOptional, IsString, MaxLength, MinLength, ValidateIf } from "class-validator";
import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";

/**
 * Fact Row
 */
export class FactRowDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  code!: NonEmptyString255;

  @IsOptional()
  @ValidateIf((object) => object.detail !== null)
  @IsString()
  @MaxLength(4000)
  detail?: Description | null;

  @IsOptional()
  @ValidateIf((object) => object.place !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  place?: Name | null;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  statement!: Name;

  @IsBoolean()
  tagged!: Flag;
}
