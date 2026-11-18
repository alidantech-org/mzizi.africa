import { IsInt, IsISO8601, IsOptional, IsString, IsUUID, Min, ValidateIf } from "class-validator";

import { Satisfies } from "#/modules/common/schema/dto/validators/satisfies.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * One step of a bill's passage in order: a reading, a committee, a vote in the other house, assent, publication. (entity)
 */
export class StagesDto {
  @IsString()
  @IsUUID()
  billId!: Id;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.motionId !== null)
  @IsString()
  @IsUUID()
  motionId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.onDate !== null)
  @IsISO8601({ strict: true })
  onDate?: CalendarDate | null;

  @IsOptional()
  @ValidateIf((object) => object.outcomeId !== null)
  @IsString()
  @IsUUID()
  outcomeId?: Id | null;

  @IsInt()
  @Min(1)
  sequenceNumber!: PositiveInteger;

  @IsOptional()
  @ValidateIf((object) => object.sittingId !== null)
  @IsString()
  @IsUUID()
  @Satisfies<StagesDto>((object) => object.sittingId != null || object.onDate != null, {
    message: "Stage Has Sitting Or Date",
  })
  sittingId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.sourceCitationId !== null)
  @IsString()
  @IsUUID()
  sourceCitationId?: Id | null;

  @IsString()
  @IsUUID()
  stageKindId!: Id;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
