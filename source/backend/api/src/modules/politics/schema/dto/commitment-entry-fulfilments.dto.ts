import { IsISO8601, IsString, IsUUID, ValidateIf } from "class-validator";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/**
 * Commitment Entry Fulfilments
 */
export class CommitmentEntryFulfilmentsDto {
  @ValidateIf((object) => object.appropriationId !== null)
  @IsString()
  @IsUUID()
  appropriationId!: Id | null;

  @ValidateIf((object) => object.billId !== null)
  @IsString()
  @IsUUID()
  billId!: Id | null;

  @ValidateIf((object) => object.contractId !== null)
  @IsString()
  @IsUUID()
  contractId!: Id | null;

  @ValidateIf((object) => object.instrumentId !== null)
  @IsString()
  @IsUUID()
  instrumentId!: Id | null;

  @IsString()
  @IsUUID()
  kindTerm!: Id;

  @ValidateIf((object) => object.projectId !== null)
  @IsString()
  @IsUUID()
  projectId!: Id | null;

  @ValidateIf((object) => object.recordedOn !== null)
  @IsISO8601({ strict: true })
  recordedOn!: CalendarDate | null;

  @IsString()
  @IsUUID()
  statusTerm!: Id;
}
