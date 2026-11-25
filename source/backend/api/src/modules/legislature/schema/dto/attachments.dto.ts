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

import { Satisfies } from "#/modules/common/schema/dto/validators/satisfies.ts";
import type { Seconds } from "#/modules/legislature/schema/type/seconds.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * Media on proceedings that are not identities (the parliamentary video of a speech). (entity)
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
  @ValidateIf((object) => object.billId !== null)
  @IsString()
  @IsUUID()
  billId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.countryId !== null)
  @IsString()
  @IsUUID()
  countryId?: Id | null;

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

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.position !== null)
  @IsInt()
  @Min(0)
  position?: NonNegativeInteger | null;

  @IsString()
  @IsUUID()
  purposeTerm!: Id;

  @IsOptional()
  @ValidateIf((object) => object.sittingId !== null)
  @IsString()
  @IsUUID()
  sittingId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.speechId !== null)
  @IsString()
  @IsUUID()
  @Satisfies<AttachmentsDto>((object) => object.speechId == null || object.countryId != null, {
    message: "Speech Attachment Has Country",
  })
  speechId?: Id | null;

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
