
import {
  IsBoolean,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from "class-validator";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";
import type { Sha256 } from "#/modules/shared/schema/type/sha256.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * Deduplicated access scope: global, or narrowed by country, geographic unit, dataset or field group. (entity)
 */
export class ScopesDto {

  @IsOptional()
  @ValidateIf((object) => object.countryRefId !== null)
  @IsString()
  @IsUUID()
  countryRefId?: Id | null;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.datasetRefId !== null)
  @IsString()
  @IsUUID()
  datasetRefId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.fieldGroup !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  fieldGroup?: NonEmptyString255 | null;

  @IsOptional()
  @ValidateIf((object) => object.geographicUnitRefId !== null)
  @IsString()
  @IsUUID()
  geographicUnitRefId?: Id | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsBoolean()
  includeDescendants!: Flag;

  @IsString()
  @IsUUID()
  institutionRefId!: Id;

  @IsBoolean()
  isGlobal!: Flag;

  @IsString()
  @Length(64, 64)
  @Matches(new RegExp("^[a-f0-9]{64}$"))
  scopeHash!: Sha256;
}