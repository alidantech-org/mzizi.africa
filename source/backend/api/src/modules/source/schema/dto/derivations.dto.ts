import {
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";

import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * Lineage: which artifact, edition or file version was made from which. (entity)
 *
 * Invariant "DerivationHasOneOutput" has no simple form, so it isn't validated here.
 *
 * Invariant "DerivationHasOneInput" has no simple form, so it isn't validated here.
 */
export class DerivationsDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  code!: IdentityCode;

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
  @ValidateIf((object) => object.inputArtifactId !== null)
  @IsString()
  @IsUUID()
  inputArtifactId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.inputEditionId !== null)
  @IsString()
  @IsUUID()
  inputEditionId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.inputVersionId !== null)
  @IsString()
  @IsUUID()
  inputVersionId?: Id | null;

  @IsString()
  @IsUUID()
  kindTerm!: Id;

  @IsOptional()
  @ValidateIf((object) => object.method !== null)
  @IsString()
  @MaxLength(4000)
  method?: Description | null;

  @IsOptional()
  @ValidateIf((object) => object.outputArtifactId !== null)
  @IsString()
  @IsUUID()
  outputArtifactId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.outputEditionId !== null)
  @IsString()
  @IsUUID()
  outputEditionId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.outputVersionId !== null)
  @IsString()
  @IsUUID()
  outputVersionId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.run !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  run?: NonEmptyString255 | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
