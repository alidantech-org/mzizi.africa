import {
  IsEnum,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateIf,
} from "class-validator";
import { LineageRole } from "#/modules/source/schema/enum/lineage-role.enum.ts";
import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * What a dataset was prepared from: a capture, a document or another dataset, with the role and method. (entity)
 */
export class DatasetLineageDto {
  @IsISO8601({})
  createdAt!: Instant;

  @IsString()
  @IsUUID()
  datasetId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.inputCaptureId !== null)
  @IsString()
  @IsUUID()
  inputCaptureId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.inputDatasetId !== null)
  @IsString()
  @IsUUID()
  inputDatasetId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.inputDocumentId !== null)
  @IsString()
  @IsUUID()
  inputDocumentId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.method !== null)
  @IsString()
  @MaxLength(4000)
  method?: Description | null;

  @IsEnum(LineageRole)
  role!: LineageRole;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
