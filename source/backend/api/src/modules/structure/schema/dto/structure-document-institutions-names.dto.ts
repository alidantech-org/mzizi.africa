import { IsBoolean, IsString, MaxLength, MinLength } from "class-validator";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";

/**
 * Structure Document Institutions Names
 */
export class StructureDocumentInstitutionsNamesDto {
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  name!: Name;

  @IsBoolean()
  preferred!: Flag;
}
