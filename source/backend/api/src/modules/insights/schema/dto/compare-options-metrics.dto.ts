import { IsBoolean, IsString } from "class-validator";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Compare Options Metrics
 */
export class CompareOptionsMetricsDto {
  @IsString()
  code!: String;

  @IsString()
  describe!: String;

  @IsString()
  domain!: String;

  @IsBoolean()
  higherIsBetter!: Flag;

  @IsString()
  title!: String;

  @IsString()
  unit!: String;
}
