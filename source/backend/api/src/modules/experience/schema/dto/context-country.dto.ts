import { IsBoolean, IsOptional, IsString, MaxLength, MinLength, ValidateIf } from "class-validator";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";

/**
 * Context Country
 */
export class ContextCountryDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  code!: NonEmptyString100;

  @IsOptional()
  @ValidateIf((object) => object.currencyCode !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  currencyCode?: NonEmptyString100 | null;

  @IsOptional()
  @ValidateIf((object) => object.defaultLanguageCode !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  defaultLanguageCode?: NonEmptyString100 | null;

  @IsBoolean()
  isServed!: Flag;

  @IsOptional()
  @ValidateIf((object) => object.isoCode !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  isoCode?: NonEmptyString100 | null;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  name!: Name;

  @IsOptional()
  @ValidateIf((object) => object.subdomain !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  subdomain?: NonEmptyString100 | null;
}
