import {
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
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * Where a record in any table came from. The loader writes one row for every seeded record, so a record's origin is a query: its dataset, the lines of the CSV and the inputs the dataset came from. (entity)
 */
export class ProvenanceDto {
  @IsOptional()
  @ValidateIf((object) => object.captureId !== null)
  @IsString()
  @IsUUID()
  captureId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.columnName !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  columnName?: NonEmptyString100 | null;

  @IsISO8601({})
  createdAt!: Instant;

  @IsString()
  @IsUUID()
  datasetId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsOptional()
  @ValidateIf((object) => object.documentId !== null)
  @IsString()
  @IsUUID()
  documentId?: Id | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.line !== null)
  @IsInt()
  @Min(1)
  line?: PositiveInteger | null;

  @IsString()
  @IsUUID()
  recordId!: Id;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  tableName!: NonEmptyString100;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
