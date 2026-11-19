import { IsOptional, IsString, ValidateIf } from "class-validator";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Coverage Item
 */
export class CoverageItemDto {
  @IsOptional()
  @ValidateIf((object) => object.checkedOn !== null)
  @IsString()
  checkedOn?: String | null;

  @IsString()
  code!: String;

  @IsOptional()
  @ValidateIf((object) => object.expectedAt !== null)
  @IsString()
  expectedAt?: String | null;

  @IsOptional()
  @ValidateIf((object) => object.level !== null)
  @IsString()
  level?: String | null;

  @IsOptional()
  @ValidateIf((object) => object.note !== null)
  @IsString()
  note?: String | null;

  @IsOptional()
  @ValidateIf((object) => object.source !== null)
  @IsString()
  source?: String | null;

  @IsString()
  subject!: String;
}
