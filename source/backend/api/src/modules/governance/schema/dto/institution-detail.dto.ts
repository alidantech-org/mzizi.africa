import { Type } from "class-transformer";
import {
  IsArray,
  IsInt,
  IsString,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  IsDefined,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { InstitutionDetailNamesDto } from "#/modules/governance/schema/dto/institution-detail-names.dto.ts";
import { InstitutionDetailOfficesDto } from "#/modules/governance/schema/dto/institution-detail-offices.dto.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";

/**
 * Institution Detail
 */
export class InstitutionDetailDto {
  @ValidateIf((object) => object.armTerm !== null)
  @IsString()
  @IsUUID()
  armTerm!: Id | null;

  @ValidateIf((object) => object.basisTerm !== null)
  @IsString()
  @IsUUID()
  basisTerm!: Id | null;

  @ValidateIf((object) => object.classTerm !== null)
  @IsString()
  @IsUUID()
  classTerm!: Id | null;

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
  countryId!: Id;

  @ValidateIf((object) => object.fromYear !== null)
  @IsInt()
  @Min(-10000)
  @Max(3000)
  fromYear!: Year | null;

  @IsString()
  @IsUUID()
  institutionId!: Id;

  @IsString()
  @IsUUID()
  kindTerm!: Id;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => InstitutionDetailNamesDto)
  names!: InstitutionDetailNamesDto[];

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => InstitutionDetailOfficesDto)
  offices!: InstitutionDetailOfficesDto[];

  @ValidateIf((object) => object.toYear !== null)
  @IsInt()
  @Min(-10000)
  @Max(3000)
  toYear!: Year | null;
}
