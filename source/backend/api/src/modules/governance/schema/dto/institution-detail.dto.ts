import { Type } from "class-transformer";
import {
  IsArray,
  IsISO8601,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { InstitutionDetailMandatesDto } from "#/modules/governance/schema/dto/institution-detail-mandates.dto.ts";
import { InstitutionDetailNamesDto } from "#/modules/governance/schema/dto/institution-detail-names.dto.ts";
import { InstitutionDetailOfficesDto } from "#/modules/governance/schema/dto/institution-detail-offices.dto.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/**
 * Institution Detail
 */
export class InstitutionDetailDto {
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

  @ValidateIf((object) => object.validFrom !== null)
  @IsISO8601({ strict: true })
  validFrom!: CalendarDate | null;

  @ValidateIf((object) => object.validUntil !== null)
  @IsISO8601({ strict: true })
  validUntil!: CalendarDate | null;
}
