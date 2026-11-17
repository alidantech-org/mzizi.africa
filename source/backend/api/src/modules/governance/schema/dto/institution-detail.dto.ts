import { Type } from "class-transformer";
import {
  IsArray,
  IsEnum,
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
import { InstitutionDetailMandatesDto } from "#/modules/governance/schema/dto/institution-detail-mandates.dto.ts";
import { InstitutionDetailNamesDto } from "#/modules/governance/schema/dto/institution-detail-names.dto.ts";
import { InstitutionDetailOfficesDto } from "#/modules/governance/schema/dto/institution-detail-offices.dto.ts";
import { DatePrecision } from "#/modules/shared/schema/enum/date-precision.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";

/**
 * Institution Detail
 */
export class InstitutionDetailDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  code!: IdentityCode;

  @ValidateIf((object) => object.fromToPrecision !== null)
  @IsEnum(DatePrecision)
  fromToPrecision!: DatePrecision | null;

  @ValidateIf((object) => object.fromYear !== null)
  @IsInt()
  @Min(-10000)
  @Max(3000)
  fromYear!: Year | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  kind!: IdentityCode;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => InstitutionDetailMandatesDto)
  mandates!: InstitutionDetailMandatesDto[];

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
