import { Type } from "class-transformer";
import {
  IsArray,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateNested,
} from "class-validator";
import { InstitutionEntryNamesDto } from "#/modules/governance/schema/dto/institution-entry-names.dto.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";

/**
 * Institution Entry
 */
export class InstitutionEntryDto {

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(new RegExp("^[a-z0-9][a-z0-9_]*(\\.[a-z0-9][a-z0-9_]*){0,15}$"))
  code!: IdentityCode;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(new RegExp("^[a-z0-9][a-z0-9_]*(\\.[a-z0-9][a-z0-9_]*){0,15}$"))
  kind!: IdentityCode;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => InstitutionEntryNamesDto)
  names!: InstitutionEntryNamesDto[];
}