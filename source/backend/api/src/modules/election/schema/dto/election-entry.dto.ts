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
import { ElectionEntryNamesDto } from "#/modules/election/schema/dto/election-entry-names.dto.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/**
 * Election Entry
 */
export class ElectionEntryDto {
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
  electionId!: Id;

  @ValidateIf((object) => object.eventId !== null)
  @IsString()
  @IsUUID()
  eventId!: Id | null;

  @IsInt()
  @Min(-10000)
  @Max(3000)
  fromYear!: Year;

  @ValidateIf((object) => object.heldOn !== null)
  @IsISO8601({ strict: true })
  heldOn!: CalendarDate | null;

  @IsString()
  @IsUUID()
  kindTerm!: Id;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => ElectionEntryNamesDto)
  names!: ElectionEntryNamesDto[];

  @IsString()
  @IsUUID()
  statusTerm!: Id;
}
