import { IsBoolean, IsString, IsUUID, MaxLength, MinLength } from "class-validator";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";

/**
 * Institution Entry Names
 */
export class InstitutionEntryNamesDto {
  @IsBoolean()
  isPreferred!: Flag;

  @IsString()
  @IsUUID()
  languageId!: Id;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  name!: Name;
}
