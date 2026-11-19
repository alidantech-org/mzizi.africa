import { IsBoolean, IsNumber, IsOptional, IsString, ValidateIf } from "class-validator";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Comparison Rows
 */
export class ComparisonRowsDto {
  @IsNumber({})
  a!: Number;

  @IsNumber({})
  b!: Number;

  @IsString()
  code!: String;

  @IsOptional()
  @ValidateIf((object) => object.diffPercent !== null)
  @IsNumber({})
  diffPercent?: Number | null;

  @IsBoolean()
  higherIsBetter!: Flag;

  @IsString()
  title!: String;

  @IsString()
  unit!: String;
}
