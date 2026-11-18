import {
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";
import type { Code } from "#/modules/experience/schema/type/code.type.ts";
import type { Language } from "#/modules/experience/schema/type/language.type.ts";
import type { Limit } from "#/modules/experience/schema/type/limit.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";

/**
 * Facilities Input
 */
export class FacilitiesInputDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  classCode?: Code;

  @IsOptional()
  @IsString()
  @IsUUID()
  featureId?: Id;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(35)
  languageCode?: Language;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(500)
  limit?: Limit;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  query?: Code;
}
