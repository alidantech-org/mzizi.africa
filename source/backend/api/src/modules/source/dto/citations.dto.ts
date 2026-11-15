
import {
  IsInt,
  IsISO8601,
  IsJSON,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
  Min,
  ValidateIf,
} from "class-validator";
import type { Id } from "#/modules/shared/type/id.type.ts";
import type { JsonText } from "#/modules/shared/type/json-text.type.ts";
import type { PositiveInteger } from "#/modules/shared/type/positive-integer.type.ts";
import type { Sha256 } from "#/modules/shared/type/sha256.type.ts";
import type { Instant } from "#/modules/shared/type/instant.type.ts";

/**
 * Exact locator in immutable bytes: PDF page/paragraph, JSON path, CSV row/column, region, timestamp or dataset record. (entity)
 */
export class CitationsDto {

  @IsOptional()
  @ValidateIf((object) => object.captureId !== null)
  @IsString()
  @IsUUID()
  captureId?: Id | null;

  @IsISO8601({})
  createdAt!: Instant;

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
  evidenceId!: Id;

  @IsString()
  @IsUUID()
  fileVersionId!: Id;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @IsJSON()
  locator!: JsonText;

  @IsString()
  @IsUUID()
  locatorKindId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.quotedHash !== null)
  @IsString()
  @Length(64, 64)
  @Matches(new RegExp("^[a-f0-9]{64}$"))
  quotedHash?: Sha256 | null;

  @IsISO8601({})
  recordedAt!: Instant;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}