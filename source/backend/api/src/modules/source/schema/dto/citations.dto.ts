import {
  IsEnum,
  IsInt,
  IsISO8601,
  IsJSON,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";

import { Satisfies } from "#/modules/common/schema/dto/validators/satisfies.ts";
import { SubjectTable } from "#/modules/shared/schema/enum/subject-table.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { JsonText } from "#/modules/shared/schema/type/json-text.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Sha256 } from "#/modules/shared/schema/type/sha256.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * Exact locator in one artifact: PDF page or paragraph, JSON path, CSV line and column, region or timestamp. (entity)
 *
 * Invariant "SubjectKeysTogether" has no simple form, so it isn't validated here.
 */
export class CitationsDto {
  @IsOptional()
  @ValidateIf((object) => object.addressId !== null)
  @IsString()
  @IsUUID()
  addressId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.artifactId !== null)
  @IsString()
  @IsUUID()
  @Satisfies<CitationsDto>(
    (object) => object.artifactId != null || object.captureId != null || object.addressId != null,
    {
      message: "Cites Something",
    },
  )
  artifactId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.captureId !== null)
  @IsString()
  @IsUUID()
  captureId?: Id | null;

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
