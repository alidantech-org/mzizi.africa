import { IsISO8601, IsString, Matches, MaxLength, MinLength, ValidateIf } from "class-validator";
import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/**
 * Institution Detail Mandates
 */
export class InstitutionDetailMandatesDto {
  @IsString()
  @MaxLength(4000)
  description!: Description;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(new RegExp("^[a-z0-9]+(-[a-z0-9]+)*(\\.[a-z0-9]+(-[a-z0-9]+)*){0,15}$"))
  kind!: IdentityCode;

  @ValidateIf((object) => object.validFrom !== null)
  @IsISO8601({ strict: true })
  validFrom!: CalendarDate | null;

  @ValidateIf((object) => object.validUntil !== null)
  @IsISO8601({ strict: true })
  validUntil!: CalendarDate | null;
}
