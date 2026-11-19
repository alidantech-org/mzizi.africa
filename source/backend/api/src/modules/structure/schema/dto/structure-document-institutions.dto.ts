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
import { StructureDocumentInstitutionsNamesDto } from "#/modules/structure/schema/dto/structure-document-institutions-names.dto.ts";
import { StructureDocumentInstitutionsPositionsDto } from "#/modules/structure/schema/dto/structure-document-institutions-positions.dto.ts";
import { StructureDocumentInstitutionsPowersDto } from "#/modules/structure/schema/dto/structure-document-institutions-powers.dto.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";

/**
 * Structure Document Institutions
 */
export class StructureDocumentInstitutionsDto {
  @ValidateIf((object) => object.arm !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  arm!: Name | null;

  @ValidateIf((object) => object.citationId !== null)
  @IsString()
  @IsUUID()
  citationId!: Id | null;

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
  id!: Id;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  kind!: Name;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => StructureDocumentInstitutionsNamesDto)
  names!: StructureDocumentInstitutionsNamesDto[];

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => StructureDocumentInstitutionsPositionsDto)
  positions!: StructureDocumentInstitutionsPositionsDto[];

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => StructureDocumentInstitutionsPowersDto)
  powers!: StructureDocumentInstitutionsPowersDto[];
}
