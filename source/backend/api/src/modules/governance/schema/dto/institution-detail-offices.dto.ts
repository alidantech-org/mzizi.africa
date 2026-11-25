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
import { InstitutionDetailOfficesHoldersDto } from "#/modules/governance/schema/dto/institution-detail-offices-holders.dto.ts";
import { InstitutionDetailOfficesNamesDto } from "#/modules/governance/schema/dto/institution-detail-offices-names.dto.ts";
import type { Seat } from "#/modules/governance/schema/type/seat.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";

/**
 * Institution Detail Offices
 */
export class InstitutionDetailOfficesDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  code!: IdentityCode;

  @ValidateIf((object) => object.featureId !== null)
  @IsString()
  @IsUUID()
  featureId!: Id | null;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => InstitutionDetailOfficesHoldersDto)
  holders!: InstitutionDetailOfficesHoldersDto[];

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => InstitutionDetailOfficesNamesDto)
  names!: InstitutionDetailOfficesNamesDto[];

  @IsString()
  @IsUUID()
  officeId!: Id;

  @ValidateIf((object) => object.order !== null)
  @IsInt()
  @Min(0)
  order!: NonNegativeInteger | null;

  @IsString()
  @IsUUID()
  roleTerm!: Id;

  @ValidateIf((object) => object.seat !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  seat!: Seat | null;
}
