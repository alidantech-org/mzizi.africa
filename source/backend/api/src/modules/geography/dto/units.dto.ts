
import {
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
} from "class-validator";

import { Satisfies } from "#/modules/common/dto/validators/satisfies.ts";
import type { Id } from "#/modules/shared/type/id.type.ts";
import type { CalendarDate } from "#/modules/shared/type/calendar-date.type.ts";

/**
 * A formally defined administrative, electoral, statistical or historical territorial specialization of one feature; country membership is optional for historic and cross-border units. (entity)
 */
export class UnitsDto {

  @IsOptional()
  @ValidateIf((object) => object.countryId !== null)
  @IsString()
  @IsUUID()
  countryId?: Id | null;

  @IsString()
  @IsUUID()
  featureId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.validFrom !== null)
  @IsISO8601({ strict: true })
  @Satisfies<UnitsDto>((object) => object.validFrom == null || object.validUntil == null || object.validFrom < object.validUntil, {
    message: "Effective Window Must Be Ordered",
  })
  validFrom?: CalendarDate | null;

  @IsOptional()
  @ValidateIf((object) => object.validUntil !== null)
  @IsISO8601({ strict: true })
  validUntil?: CalendarDate | null;
}