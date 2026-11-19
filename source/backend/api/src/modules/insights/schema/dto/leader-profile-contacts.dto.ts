import { IsString } from "class-validator";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Leader Profile Contacts
 */
export class LeaderProfileContactsDto {
  @IsString()
  kind!: String;

  @IsString()
  scope!: String;

  @IsString()
  value!: String;

  @IsString()
  visibility!: String;
}
