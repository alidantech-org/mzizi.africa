import {
  IsInt,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateIf,
} from "class-validator";
import type { Seconds } from "#/modules/civic/schema/type/seconds.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * Media on projects, contracts and deliveries (site photos, signed contracts). (entity)
 *
 * Invariant "AttachmentHasOneRow" has no simple form, so it isn't validated here.
 *
 * Invariant "AttachmentHasOneMedia" has no simple form, so it isn't validated here.
 */
export class AttachmentsDto {
  @IsOptional()
  @ValidateIf((object) => object.articleId !== null)
  @IsString()
  @IsUUID()
  articleId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.assetId !== null)
  @IsString()
  @IsUUID()
  assetId?: Id | null;

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

  @IsOptional()
  @ValidateIf((object) => object.deliveryId !== null)
  @IsString()
  @IsUUID()
  deliveryId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.endSecond !== null)
  @IsNumber({})
  @Min(0)
  endSecond?: Seconds | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.position !== null)
  @IsInt()
  @Min(0)
  position?: NonNegativeInteger | null;

  @IsOptional()
  @ValidateIf((object) => object.projectId !== null)
  @IsString()
  @IsUUID()
  projectId?: Id | null;

  @IsString()
  @IsUUID()
  purposeTerm!: Id;

  @IsOptional()
  @ValidateIf((object) => object.startSecond !== null)
  @IsNumber({})
  @Min(0)
  startSecond?: Seconds | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
