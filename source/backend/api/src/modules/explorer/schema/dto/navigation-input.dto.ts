import { IsOptional, IsString, Length, Matches, MaxLength, MinLength } from "class-validator";
import type { Path } from "#/modules/explorer/schema/type/path.type.ts";
import type { IsoAlpha2 } from "#/modules/reference/schema/type/iso-alpha2.type.ts";

/**
 * Navigation Input
 */
export class NavigationInputDto {
  @IsString()
  @Length(2, 2)
  @Matches(new RegExp("^[A-Z]{2}$"))
  countryCode!: IsoAlpha2;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(1500)
  path?: Path;
}
