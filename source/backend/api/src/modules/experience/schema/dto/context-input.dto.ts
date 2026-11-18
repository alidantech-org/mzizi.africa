import { IsOptional, IsString, IsUUID, MaxLength, MinLength } from "class-validator";
import type { Code } from "#/modules/experience/schema/type/code.type.ts";
import type { Language } from "#/modules/experience/schema/type/language.type.ts";
import type { Path } from "#/modules/experience/schema/type/path.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";

/**
 * Context Input
 */
export class ContextInputDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  countryCode?: Code;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  edgeCountry?: Code;

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
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  path?: Path;
}
