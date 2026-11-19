import { IsOptional, IsString, ValidateIf } from "class-validator";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Manifesto
 */
export class ManifestoDto {
  @IsString()
  code!: String;

  @IsOptional()
  @ValidateIf((object) => object.election !== null)
  @IsString()
  election?: String | null;

  @IsOptional()
  @ValidateIf((object) => object.party !== null)
  @IsString()
  party?: String | null;

  @IsOptional()
  @ValidateIf((object) => object.publishedOn !== null)
  @IsString()
  publishedOn?: String | null;
}
