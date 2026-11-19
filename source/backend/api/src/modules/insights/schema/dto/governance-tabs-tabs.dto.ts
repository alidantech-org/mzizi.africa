import { IsArray, IsNumber, IsString } from "class-validator";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Governance Tabs Tabs
 */
export class GovernanceTabsTabsDto {
  @IsString()
  about!: String;

  @IsString()
  code!: String;

  @IsNumber({})
  count!: Number;

  @IsArray()
  @IsString({ each: true })
  includes!: String[];

  @IsString()
  kind!: String;

  @IsString()
  label!: String;
}
