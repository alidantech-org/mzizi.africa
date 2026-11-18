import {
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";

import { Satisfies } from "#/modules/common/schema/dto/validators/satisfies.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * A meaningful legal content state of an instrument. Not a download and not a Source publication edition. (entity)
 */
export class EditionsDto {
  @IsOptional()
  @ValidateIf((object) => object.ceasedOn !== null)
  @IsISO8601({ strict: true })
  ceasedOn?: CalendarDate | null;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  code!: IdentityCode;

  @IsOptional()
  @ValidateIf((object) => object.commencedOn !== null)
  @IsISO8601({ strict: true })
  commencedOn?: CalendarDate | null;

  @IsOptional()
  @ValidateIf((object) => object.consolidatedOn !== null)
  @IsISO8601({ strict: true })
  consolidatedOn?: CalendarDate | null;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  designation!: NonEmptyString255;

  @IsString()
  @IsUUID()
  @Satisfies<EditionsDto>((object) => object.id !== object.supersedesId, {
    message: "Edition Must Not Supersede Itself",
  })
  id!: Id;

  @IsString()
  @IsUUID()
  instrumentId!: Id;

  @IsISO8601({})
  observedAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.repealedOn !== null)
  @IsISO8601({ strict: true })
  repealedOn?: CalendarDate | null;

  @IsOptional()
  @ValidateIf((object) => object.supersedesId !== null)
  @IsString()
  @IsUUID()
  supersedesId?: Id | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
