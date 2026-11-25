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
import { OfficeEntryHoldersDto } from "#/modules/governance/schema/dto/office-entry-holders.dto.ts";
import { OfficeEntryNamesDto } from "#/modules/governance/schema/dto/office-entry-names.dto.ts";
import type { Seat } from "#/modules/governance/schema/type/seat.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";

/**
 * Office Entry
 */
export class OfficeEntryDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  code!: IdentityCode;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => OfficeEntryHoldersDto)
  holders!: OfficeEntryHoldersDto[];

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  institutionCode!: IdentityCode;

  @IsString()
  @IsUUID()
  institutionId!: Id;

  @ValidateIf((object) => object.methodTerm !== null)
  @IsString()
  @IsUUID()
  methodTerm!: Id | null;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => OfficeEntryNamesDto)
  names!: OfficeEntryNamesDto[];

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
