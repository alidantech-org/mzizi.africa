import { IsInt, IsISO8601, IsOptional, IsString, IsUUID, Min, ValidateIf } from "class-validator";

import { Satisfies } from "#/modules/common/schema/dto/validators/satisfies.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * A person who acted in a buying process (evaluated, approved, signed), with the role and the office held then; this is what lets a conflict be checked on a real signature. (entity)
 */
export class OfficialsDto {
  @IsOptional()
  @ValidateIf((object) => object.actedOn !== null)
  @IsISO8601({ strict: true })
  actedOn?: CalendarDate | null;

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
  id!: Id;

  @IsString()
  @IsUUID()
  individualId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.officeId !== null)
  @IsString()
  @IsUUID()
  officeId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.procurementId !== null)
  @IsString()
  @IsUUID()
  @Satisfies<OfficialsDto>((object) => object.procurementId != null || object.contractId != null, {
    message: "Has Procurement Or Contract",
  })
  procurementId?: Id | null;

  @IsString()
  @IsUUID()
  roleId!: Id;

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
