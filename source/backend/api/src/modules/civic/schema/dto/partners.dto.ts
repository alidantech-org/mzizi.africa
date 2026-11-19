import {
  IsInt,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateIf,
} from "class-validator";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Percentage } from "#/modules/shared/schema/type/percentage.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * A party that shares one contract or one bid with the main bidder or contractor: a joint-venture member, a subcontractor or a guarantor. (entity)
 *
 * Invariant "HasExactlyOneDeal" has no simple form, so it isn't validated here.
 */
export class PartnersDto {
  @IsOptional()
  @ValidateIf((object) => object.bidId !== null)
  @IsString()
  @IsUUID()
  bidId?: Id | null;

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
  partnerEntityId!: Id;

  @IsString()
  @IsUUID()
  roleId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.sharePercentage !== null)
  @IsNumber({})
  @Min(0)
  @Max(100)
  sharePercentage?: Percentage | null;

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
