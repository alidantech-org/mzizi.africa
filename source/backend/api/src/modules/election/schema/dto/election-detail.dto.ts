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
import { ElectionDetailContestsDto } from "#/modules/election/schema/dto/election-detail-contests.dto.ts";
import { ElectionDetailNamesDto } from "#/modules/election/schema/dto/election-detail-names.dto.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/**
 * Election Detail
 */
export class ElectionDetailDto {
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
  @Type(() => ElectionDetailContestsDto)
  contests!: ElectionDetailContestsDto[];

  @IsString()
  @IsUUID()
  electionId!: Id;

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
  @Type(() => ElectionDetailNamesDto)
  names!: ElectionDetailNamesDto[];

  @IsString()
  @IsUUID()
  statusTerm!: Id;
}
