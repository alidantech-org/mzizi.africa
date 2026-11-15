
import {
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateIf,
} from "class-validator";

import { Satisfies } from "#/modules/common/schema/dto/validators/satisfies.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * Dated release binding; activation never changes releases already pinned by running jobs. (entity)
 */
export class ManifestBindingsDto {

  @IsISO8601({})
  activatedAt!: Instant;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deactivatedAt !== null)
  @IsISO8601({})
  deactivatedAt?: Instant | null;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsISO8601({})
  @Satisfies<ManifestBindingsDto>((object) => object.effectiveFrom == null || object.effectiveUntil == null || object.effectiveFrom < object.effectiveUntil, {
    message: "Effective Window Is Ordered",
  })
  effectiveFrom!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.effectiveUntil !== null)
  @IsISO8601({})
  effectiveUntil?: Instant | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @IsUUID()
  manifestReleaseId!: Id;

  @IsString()
  @IsUUID()
  sourceId!: Id;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}