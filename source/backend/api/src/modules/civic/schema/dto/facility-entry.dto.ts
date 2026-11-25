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
import { FacilityEntryNamesDto } from "#/modules/civic/schema/dto/facility-entry-names.dto.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";

/**
 * Facility Entry
 */
export class FacilityEntryDto {
  @IsString()
  @IsUUID()
  classTerm!: Id;

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
  facilityId!: Id;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => FacilityEntryNamesDto)
  names!: FacilityEntryNamesDto[];

  @ValidateIf((object) => object.ownershipTerm !== null)
  @IsString()
  @IsUUID()
  ownershipTerm!: Id | null;

  @ValidateIf((object) => object.statusTerm !== null)
  @IsString()
  @IsUUID()
  statusTerm!: Id | null;
}
