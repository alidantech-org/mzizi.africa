
import {
  IsBoolean,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";
import type { Flag } from "#/modules/shared/type/flag.type.ts";
import type { Name } from "#/modules/shared/type/name.type.ts";

/**
 * Office Detail Holders Names
 */
export class OfficeDetailHoldersNamesDto {

  @IsBoolean()
  isPreferred!: Flag;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  name!: Name;
}