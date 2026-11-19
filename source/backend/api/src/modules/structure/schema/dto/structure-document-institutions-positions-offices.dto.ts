import {
  IsInt,
  IsISO8601,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/**
 * Structure Document Institutions Positions Offices
 */
export class StructureDocumentInstitutionsPositionsOfficesDto {
  @ValidateIf((object) => object.abolishedOn !== null)
  @IsISO8601({ strict: true })
  abolishedOn!: CalendarDate | null;

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

  @IsString()
  @IsUUID()
  id!: Id;

  @ValidateIf((object) => object.ordinal !== null)
  @IsInt()
  @Min(1)
  ordinal!: PositiveInteger | null;
}
