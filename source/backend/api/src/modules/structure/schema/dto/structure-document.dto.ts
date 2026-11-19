import { Type } from "class-transformer";
import {
  IsArray,
  IsString,
  IsUUID,
  Length,
  Matches,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { StructureDocumentFunctionsDto } from "#/modules/structure/schema/dto/structure-document-functions.dto.ts";
import { StructureDocumentInstitutionsDto } from "#/modules/structure/schema/dto/structure-document-institutions.dto.ts";
import { StructureDocumentProceduresDto } from "#/modules/structure/schema/dto/structure-document-procedures.dto.ts";
import type { IsoAlpha2 } from "#/modules/reference/schema/type/iso-alpha2.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";

/**
 * Structure Document
 */
export class StructureDocumentDto {
  @ValidateIf((object) => object.countryCode !== null)
  @IsString()
  @Length(2, 2)
  @Matches(new RegExp("^[A-Z]{2}$"))
  countryCode!: IsoAlpha2 | null;

  @IsString()
  @IsUUID()
  countryId!: Id;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  countryName!: Name;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => StructureDocumentFunctionsDto)
  functions!: StructureDocumentFunctionsDto[];

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => StructureDocumentInstitutionsDto)
  institutions!: StructureDocumentInstitutionsDto[];

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => StructureDocumentProceduresDto)
  procedures!: StructureDocumentProceduresDto[];
}
