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
import { OfficeDetailHoldersDto } from "#/modules/governance/schema/dto/office-detail-holders.dto.ts";
import { OfficeDetailNamesDto } from "#/modules/governance/schema/dto/office-detail-names.dto.ts";
import type { Seat } from "#/modules/governance/schema/type/seat.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * Office Detail
 */
export class OfficeDetailDto {
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
  @Type(() => OfficeDetailHoldersDto)
  holders!: OfficeDetailHoldersDto[];

  @IsString()
  @IsUUID()
  institutionId!: Id;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => OfficeDetailNamesDto)
  names!: OfficeDetailNamesDto[];

  @IsString()
  @IsUUID()
  officeId!: Id;

  @IsString()
  @IsUUID()
  positionId!: Id;

  @IsString()
  @IsUUID()
  roleTerm!: Id;

  @ValidateIf((object) => object.seat !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  seat!: Seat | null;

  @ValidateIf((object) => object.termLimit !== null)
  @IsInt()
  @Min(1)
  termLimit!: PositiveInteger | null;

  @ValidateIf((object) => object.termYears !== null)
  @IsInt()
  @Min(1)
  termYears!: PositiveInteger | null;
}
