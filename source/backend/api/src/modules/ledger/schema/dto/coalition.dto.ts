import { IsOptional, IsString, ValidateIf } from "class-validator";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Coalition
 */
export class CoalitionDto {
  @IsString()
  code!: String;

  @IsOptional()
  @ValidateIf((object) => object.dissolvedOn !== null)
  @IsString()
  dissolvedOn?: String | null;

  @IsOptional()
  @ValidateIf((object) => object.formedOn !== null)
  @IsString()
  formedOn?: String | null;

  @IsString()
  kind!: String;

  @IsString()
  name!: String;
}
