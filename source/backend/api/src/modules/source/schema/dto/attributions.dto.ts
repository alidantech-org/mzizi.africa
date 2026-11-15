import {
  IsInt,
  IsISO8601,
  IsJSON,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";
import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { JsonText } from "#/modules/shared/schema/type/json-text.type.ts";
import type { NonEmptyString1000 } from "#/modules/shared/schema/type/non-empty-string1000.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * Accepted rights and credit statement tied to exact content and publisher. (entity)
 */
export class AttributionsDto {
  @IsISO8601({})
  assessedAt!: Instant;

  @IsString()
  @IsJSON()
  assessorSnapshot!: JsonText;

  @IsISO8601({})
  createdAt!: Instant;

  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  credit!: NonEmptyString1000;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsString()
  @IsUUID()
  fileVersionId!: Id;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.licenseValueId !== null)
  @IsString()
  @IsUUID()
  licenseValueId?: Id | null;

  @IsString()
  @IsUUID()
  publisherId!: Id;

  @IsString()
  @MaxLength(4000)
  rightsStatement!: Description;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
