import { IsNumber, IsString } from "class-validator";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Institution Detail Metrics
 */
export class InstitutionDetailMetricsDto {
  @IsString()
  label!: String;

  @IsNumber({})
  value!: Number;
}
