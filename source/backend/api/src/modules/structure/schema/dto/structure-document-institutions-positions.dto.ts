import { Type } from "class-transformer";
import {
  IsArray,
  IsInt,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  Min,
  MinLength,
  IsDefined,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { StructureDocumentInstitutionsPositionsOfficesDto } from "#/modules/structure/schema/dto/structure-document-institutions-positions-offices.dto.ts";
import { StructureDocumentInstitutionsPositionsPowersDto } from "#/modules/structure/schema/dto/structure-document-institutions-positions-powers.dto.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * Structure Document Institutions Positions
 */
export class StructureDocumentInstitutionsPositionsDto {
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

  @ValidateIf((object) => object.fixedSeats !== null)
  @IsInt()
  @Min(1)
  fixedSeats!: PositiveInteger | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => StructureDocumentInstitutionsPositionsOfficesDto)
  offices!: StructureDocumentInstitutionsPositionsOfficesDto[];

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => StructureDocumentInstitutionsPositionsPowersDto)
  powers!: StructureDocumentInstitutionsPositionsPowersDto[];

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  role!: Name;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  seatBasisCode!: IdentityCode;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  seatBasisLabel!: Name;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  selectionCode!: IdentityCode;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  selectionLabel!: Name;

  @ValidateIf((object) => object.termLimit !== null)
  @IsInt()
  @Min(1)
  termLimit!: PositiveInteger | null;

  @ValidateIf((object) => object.termYears !== null)
  @IsInt()
  @Min(1)
  termYears!: PositiveInteger | null;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  title!: Name;

  @ValidateIf((object) => object.unitLevelId !== null)
  @IsString()
  @IsUUID()
  unitLevelId!: Id | null;
}
