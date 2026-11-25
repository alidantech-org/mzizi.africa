import { IsInt, IsISO8601, IsOptional, IsString, IsUUID, Min, ValidateIf } from "class-validator";

import { Satisfies } from "#/modules/common/schema/dto/validators/satisfies.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * A block on an account that posted bad content; a blocked account cannot sign in or contribute. (entity)
 */
export class BlocksDto {
  @IsString()
  @IsUUID()
  accountId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.caseId !== null)
  @IsString()
  @IsUUID()
  caseId?: Id | null;

  @IsISO8601({})
  createdAt!: Instant;

  @IsString()
  @IsUUID()
  decidedBy!: Id;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsISO8601({ strict: true })
  @Satisfies<BlocksDto>(
    (object) => object.fromOn == null || object.toOn == null || object.fromOn <= object.toOn,
    {
      message: "Block Dates Are Ordered",
    },
  )
  fromOn!: CalendarDate;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @IsUUID()
  reasonTerm!: Id;

  @IsOptional()
  @ValidateIf((object) => object.toOn !== null)
  @IsISO8601({ strict: true })
  toOn?: CalendarDate | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
