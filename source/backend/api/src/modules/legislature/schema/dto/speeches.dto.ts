import { IsInt, IsISO8601, IsOptional, IsString, IsUUID, Min, ValidateIf } from "class-validator";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * One speech in a sitting. (entity)
 */
export class SpeechesDto {
  @IsOptional()
  @ValidateIf((object) => object.billId !== null)
  @IsString()
  @IsUUID()
  billId?: Id | null;

  @IsString()
  @IsUUID()
  countryId!: Id;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsOptional()
  @ValidateIf((object) => object.hansardId !== null)
  @IsString()
  @IsUUID()
  hansardId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.holderId !== null)
  @IsString()
  @IsUUID()
  holderId?: Id | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @IsUUID()
  kindTerm!: Id;

  @IsOptional()
  @ValidateIf((object) => object.motionId !== null)
  @IsString()
  @IsUUID()
  motionId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.page !== null)
  @IsInt()
  @Min(1)
  page?: PositiveInteger | null;

  @IsInt()
  @Min(1)
  position!: PositiveInteger;

  @IsString()
  @IsUUID()
  sittingId!: Id;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;

  @IsOptional()
  @ValidateIf((object) => object.wordCount !== null)
  @IsInt()
  @Min(0)
  wordCount?: NonNegativeInteger | null;
}
