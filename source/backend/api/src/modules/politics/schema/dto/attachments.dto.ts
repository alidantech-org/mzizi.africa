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
import type { Seconds } from "#/modules/politics/schema/type/seconds.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * Media on commitments, fulfilments and manifestos (the video of a promise). (entity)
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
  @ValidateIf((object) => object.commitmentId !== null)
  @IsString()
  @IsUUID()
  commitmentId?: Id | null;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsOptional()
  @ValidateIf((object) => object.endSecond !== null)
  @IsNumber({})
  @Min(0)
  endSecond?: Seconds | null;

  @IsOptional()
  @ValidateIf((object) => object.fulfilmentId !== null)
  @IsString()
  @IsUUID()
  fulfilmentId?: Id | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.manifestoId !== null)
  @IsString()
  @IsUUID()
  manifestoId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.position !== null)
  @IsInt()
  @Min(0)
  position?: NonNegativeInteger | null;

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
