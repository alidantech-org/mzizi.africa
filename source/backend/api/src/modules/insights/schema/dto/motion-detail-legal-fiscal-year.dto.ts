import { IsString } from "class-validator";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Motion Detail Legal Fiscal Year
 */
export class MotionDetailLegalFiscalYearDto {
  @IsString()
  code!: String;

  @IsString()
  endsOn!: String;

  @IsString()
  startsOn!: String;
}
