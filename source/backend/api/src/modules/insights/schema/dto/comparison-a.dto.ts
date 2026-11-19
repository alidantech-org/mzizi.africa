import { IsString } from "class-validator";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Comparison A
 */
export class ComparisonADto {
  @IsString()
  featureId!: String;

  @IsString()
  kindCode!: String;

  @IsString()
  kindLabel!: String;

  @IsString()
  name!: String;

  @IsString()
  path!: String;
}
