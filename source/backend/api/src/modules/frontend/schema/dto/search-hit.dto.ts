import { Type } from "class-transformer";
import {
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateNested,
} from "class-validator";
import { LocalizedTextDto } from "#/modules/shared/schema/dto/localized-text.dto.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";

/**
 * Search Hit
 */
export class SearchHitDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  code!: IdentityCode;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedTextDto)
  context?: LocalizedTextDto;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  kind!: NonEmptyString100;

  @IsDefined()
  @ValidateNested()
  @Type(() => LocalizedTextDto)
  name!: LocalizedTextDto;
}
