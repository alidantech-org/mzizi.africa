import { Type } from "class-transformer";
import {
  IsArray,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { ChildEntryNamesDto } from "#/modules/geography/schema/dto/child-entry-names.dto.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";

/**
 * Child Entry
 */
export class ChildEntryDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  code!: IdentityCode;

  @IsString()
  @IsUUID()
  featureId!: Id;

  @ValidateIf((object) => object.hierarchyId !== null)
  @IsString()
  @IsUUID()
  hierarchyId!: Id | null;

  @IsString()
  @IsUUID()
  kindTerm!: Id;

  @ValidateIf((object) => object.levelId !== null)
  @IsString()
  @IsUUID()
  levelId!: Id | null;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => ChildEntryNamesDto)
  names!: ChildEntryNamesDto[];
}
