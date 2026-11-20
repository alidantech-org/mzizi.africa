import {
  IsBoolean,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Length,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from "class-validator";
import type { IsoAlpha2 } from "#/modules/reference/schema/type/iso-alpha2.type.ts";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { Url } from "#/modules/shared/schema/type/url.type.ts";

/**
 * Country Choice
 */
export class CountryChoiceDto {
  @IsString()
  @Length(2, 2)
  @Matches(new RegExp("^[A-Z]{2}$"))
  code!: IsoAlpha2;

  @IsOptional()
  @ValidateIf((object) => object.flagUrl !== null)
  @IsString()
  @IsUrl()
  @MaxLength(2048)
  flagUrl?: Url | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  name!: Name;

  @IsOptional()
  @ValidateIf((object) => object.rootFeatureId !== null)
  @IsString()
  @IsUUID()
  rootFeatureId?: Id | null;

  @IsBoolean()
  served!: Flag;
}
