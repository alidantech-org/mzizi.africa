import { IsString, IsUUID, MaxLength, MinLength } from "class-validator";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";

/**
 * Feature Entry Names
 */
export class FeatureEntryNamesDto {
  @IsString()
  @IsUUID()
  languageId!: Id;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  name!: Name;
}
