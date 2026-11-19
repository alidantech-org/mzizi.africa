import { IsNumber, IsOptional, IsString, ValidateIf } from "class-validator";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Compare Options Top
 */
export class CompareOptionsTopDto {
  @IsString()
  detail!: String;

  @IsString()
  featureId!: String;

  @IsString()
  name!: String;

  @IsString()
  path!: String;

  @IsNumber({})
  rank!: Number;

  @IsNumber({})
  share!: Number;

  @IsOptional()
  @ValidateIf((object) => object.subjectId !== null)
  @IsString()
  subjectId?: String | null;

  @IsNumber({})
  value!: Number;
}
