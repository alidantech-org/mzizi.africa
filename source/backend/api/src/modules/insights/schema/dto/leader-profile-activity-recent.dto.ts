import { IsString } from "class-validator";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Leader Profile Activity Recent
 */
export class LeaderProfileActivityRecentDto {
  @IsString()
  code!: String;

  @IsString()
  heldOn!: String;

  @IsString()
  outcome!: String;

  @IsString()
  position!: String;

  @IsString()
  title!: String;
}
