import { IsNumber, IsOptional, IsString, ValidateIf } from "class-validator";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Motion Detail Motion Contributions
 */
export class MotionDetailMotionContributionsDto {
  @IsString()
  holderId!: String;

  @IsString()
  kind!: String;

  @IsString()
  name!: String;

  @IsOptional()
  @ValidateIf((object) => object.party !== null)
  @IsString()
  party?: String | null;

  @IsString()
  summary!: String;

  @IsNumber({})
  wordCount!: Number;
}
