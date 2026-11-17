import {
  IsEnum,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";
import { SubjectTable } from "#/modules/shared/schema/enum/subject-table.enum.ts";
import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * A classified connection from an input to an output or a domain record: derivation, extraction, translation, support. Exact locations are citations on the relationship. (entity)
 *
 * Invariant "SubjectKeysTogether" has no simple form, so it isn't validated here.
 *
 * Invariant "ExactlyOneOutput" has no simple form, so it isn't validated here.
 *
 * Invariant "ExactlyOneInput" has no simple form, so it isn't validated here.
 */
export class RelationshipsDto {
  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsOptional()
  @ValidateIf((object) => object.executionRef !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  executionRef?: NonEmptyString255 | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.inputArtifactId !== null)
  @IsString()
  @IsUUID()
  inputArtifactId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.inputCaptureId !== null)
  @IsString()
  @IsUUID()
  inputCaptureId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.inputEditionId !== null)
  @IsString()
  @IsUUID()
  inputEditionId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.inputFileVersionId !== null)
  @IsString()
  @IsUUID()
  inputFileVersionId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.inputProductId !== null)
  @IsString()
  @IsUUID()
  inputProductId?: Id | null;

  @IsString()
  @IsUUID()
  kindId!: Id;

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
  @ValidateIf((object) => object.outputCaptureId !== null)
  @IsString()
  @IsUUID()
  outputCaptureId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.outputEditionId !== null)
  @IsString()
  @IsUUID()
  outputEditionId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.outputFileVersionId !== null)
  @IsString()
  @IsUUID()
  outputFileVersionId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.outputProductId !== null)
  @IsString()
  @IsUUID()
  outputProductId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.subjectId !== null)
  @IsString()
  @IsUUID()
  subjectId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.subjectTable !== null)
  @IsEnum(SubjectTable)
  subjectTable?: SubjectTable | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
