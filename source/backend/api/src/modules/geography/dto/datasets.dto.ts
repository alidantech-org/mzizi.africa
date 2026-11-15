
import {
  IsInt,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";

import { Satisfies } from "#/modules/common/dto/validators/satisfies.ts";
import type { Description } from "#/modules/shared/description.type.ts";
import type { Id } from "#/modules/shared/id.type.ts";
import type { IdentityCode } from "#/modules/shared/identity-code.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/non-empty-string100.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/non-empty-string255.type.ts";
import type { Number } from "#/modules/shared/number.type.ts";
import type { PositiveInteger } from "#/modules/shared/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/**
 * Catalog metadata for vector, raster, climate, elevation, historical and derived datasets. Large assets remain in the existing Filesystem/SeaweedFS S3 system; external references await executable Source and Filesystem contracts. (entity)
 */
export class DatasetsDto {

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(new RegExp("^[a-z0-9][a-z0-9_]*(\\.[a-z0-9][a-z0-9_]*){0,15}$"))
  code!: IdentityCode;

  @IsOptional()
  @ValidateIf((object) => object.coverageFeatureId !== null)
  @IsString()
  @IsUUID()
  coverageFeatureId?: Id | null;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.crs !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  crs?: NonEmptyString100 | null;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsOptional()
  @ValidateIf((object) => object.fileVersionRefId !== null)
  @IsString()
  @IsUUID()
  fileVersionRefId?: Id | null;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  format!: NonEmptyString100;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.qualityNotes !== null)
  @IsString()
  @MaxLength(4000)
  qualityNotes?: Description | null;

  @IsString()
  @IsUUID()
  representationId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.resolution !== null)
  @IsNumber({})
  @Satisfies<DatasetsDto>((object) => object.resolution == null || object.resolution > 0, {
    message: "Dataset Resolution Must Be Positive",
  })
  resolution?: Number | null;

  @IsOptional()
  @ValidateIf((object) => object.resolutionUnitId !== null)
  @IsString()
  @IsUUID()
  resolutionUnitId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.sourceRefId !== null)
  @IsString()
  @IsUUID()
  sourceRefId?: Id | null;

  @IsString()
  @IsUUID()
  subjectId!: Id;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  title!: NonEmptyString255;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}