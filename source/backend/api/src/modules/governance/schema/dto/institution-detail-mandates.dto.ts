import {
  IsEnum,
  IsInt,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";
import { DatePrecision } from "#/modules/shared/schema/enum/date-precision.enum.ts";
import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";

/**
 * Institution Detail Mandates
 */
export class InstitutionDetailMandatesDto {
  @IsString()
  @MaxLength(4000)
  description!: Description;

  @ValidateIf((object) => object.fromToPrecision !== null)
  @IsEnum(DatePrecision)
  fromToPrecision!: DatePrecision | null;

  @ValidateIf((object) => object.fromYear !== null)
  @IsInt()
  @Min(-10000)
  @Max(3000)
  fromYear!: Year | null;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  kind!: IdentityCode;

  @ValidateIf((object) => object.toYear !== null)
  @IsInt()
  @Min(-10000)
  @Max(3000)
  toYear!: Year | null;
}
