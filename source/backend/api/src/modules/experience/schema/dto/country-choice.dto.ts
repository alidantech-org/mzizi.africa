import { IsBoolean, IsString, MaxLength, MinLength } from "class-validator";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";

/**
 * Country Choice
 */
export class CountryChoiceDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  code!: NonEmptyString100;

  @IsBoolean()
  isServed!: Flag;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  name!: Name;
}
