import { IsInt, IsISO8601, IsOptional, IsString, IsUUID, Min, ValidateIf } from "class-validator";

import { Satisfies } from "#/modules/common/schema/dto/validators/satisfies.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * A recorded link from a promise to what delivered it, with how the link was made and whether it is reviewed. (entity)
 */
export class FulfilmentsDto {
  @IsOptional()
  @ValidateIf((object) => object.appropriationId !== null)
  @IsString()
  @IsUUID()
  appropriationId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.billId !== null)
  @IsString()
  @IsUUID()
  billId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.contractId !== null)
  @IsString()
  @IsUUID()
  contractId?: Id | null;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsString()
  @IsUUID()
  evidenceStatusId!: Id;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.instrumentId !== null)
  @IsString()
  @IsUUID()
  instrumentId?: Id | null;

  @IsString()
  @IsUUID()
  kindId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.projectId !== null)
  @IsString()
  @IsUUID()
  @Satisfies<FulfilmentsDto>(
    (object) =>
      object.projectId != null ||
      object.contractId != null ||
      object.appropriationId != null ||
      object.billId != null ||
      object.instrumentId != null,
    {
      message: "Links Something",
    },
  )
  projectId?: Id | null;

  @IsString()
  @IsUUID()
  promiseId!: Id;

  @IsISO8601({ strict: true })
  recordedOn!: CalendarDate;

  @IsOptional()
  @ValidateIf((object) => object.sourceCitationId !== null)
  @IsString()
  @IsUUID()
  sourceCitationId?: Id | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
