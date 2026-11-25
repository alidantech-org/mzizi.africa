import { Type } from "class-transformer";
import {
  IsArray,
  IsInt,
  IsISO8601,
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
import { OfficeDetailHoldersNamesDto } from "#/modules/governance/schema/dto/office-detail-holders-names.dto.ts";
import { OfficeDetailHoldersStepsDto } from "#/modules/governance/schema/dto/office-detail-holders-steps.dto.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/**
 * Office Detail Holders
 */
export class OfficeDetailHoldersDto {
  @ValidateIf((object) => object.endsOn !== null)
  @IsISO8601({ strict: true })
  endsOn!: CalendarDate | null;

  @ValidateIf((object) => object.fromYear !== null)
  @IsInt()
  @Min(-10000)
  @Max(3000)
  fromYear!: Year | null;

  @IsString()
  @IsUUID()
  holderId!: Id;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  individualCode!: IdentityCode;

  @IsString()
  @IsUUID()
  individualId!: Id;

  @IsString()
  @IsUUID()
  methodTerm!: Id;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => OfficeDetailHoldersNamesDto)
  names!: OfficeDetailHoldersNamesDto[];

  @ValidateIf((object) => object.startsOn !== null)
  @IsISO8601({ strict: true })
  startsOn!: CalendarDate | null;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => OfficeDetailHoldersStepsDto)
  steps!: OfficeDetailHoldersStepsDto[];

  @ValidateIf((object) => object.toYear !== null)
  @IsInt()
  @Min(-10000)
  @Max(3000)
  toYear!: Year | null;
}
