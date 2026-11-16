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
import { OfficeDetailHoldersNamesDto } from "#/modules/governance/schema/dto/office-detail-holders-names.dto.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/**
 * Office Detail Holders
 */
export class OfficeDetailHoldersDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(new RegExp("^[a-z0-9]+(-[a-z0-9]+)*(\\.[a-z0-9]+(-[a-z0-9]+)*){0,15}$"))
  appointment!: IdentityCode;

  @IsString()
  @IsUUID()
  individualId!: Id;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => OfficeDetailHoldersNamesDto)
  names!: OfficeDetailHoldersNamesDto[];

  @ValidateIf((object) => object.validFrom !== null)
  @IsISO8601({ strict: true })
  validFrom!: CalendarDate | null;

  @ValidateIf((object) => object.validUntil !== null)
  @IsISO8601({ strict: true })
  validUntil!: CalendarDate | null;
}
