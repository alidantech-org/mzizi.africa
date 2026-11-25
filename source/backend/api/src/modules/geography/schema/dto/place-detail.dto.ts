import { Type } from "class-transformer";
import {
  IsArray,
  IsEnum,
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
import { PlaceDetailNamesDto } from "#/modules/geography/schema/dto/place-detail-names.dto.ts";
import { PlaceDetailParentsDto } from "#/modules/geography/schema/dto/place-detail-parents.dto.ts";
import { IdentityKind } from "#/modules/shared/schema/enum/identity-kind.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/**
 * Place Detail
 */
export class PlaceDetailDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  code!: IdentityCode;

  @ValidateIf((object) => object.endedOn !== null)
  @IsISO8601({ strict: true })
  endedOn!: CalendarDate | null;

  @ValidateIf((object) => object.establishedOn !== null)
  @IsISO8601({ strict: true })
  establishedOn!: CalendarDate | null;

  @IsString()
  @IsUUID()
  featureId!: Id;

  @ValidateIf((object) => object.fromYear !== null)
  @IsInt()
  @Min(-10000)
  @Max(3000)
  fromYear!: Year | null;

  @IsEnum(IdentityKind)
  identityKind!: IdentityKind;

  @IsString()
  @IsUUID()
  kindTerm!: Id;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => PlaceDetailNamesDto)
  names!: PlaceDetailNamesDto[];

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => PlaceDetailParentsDto)
  parents!: PlaceDetailParentsDto[];

  @ValidateIf((object) => object.toYear !== null)
  @IsInt()
  @Min(-10000)
  @Max(3000)
  toYear!: Year | null;
}
