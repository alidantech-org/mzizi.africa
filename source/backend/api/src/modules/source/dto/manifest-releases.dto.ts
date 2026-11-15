
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

import { Satisfies } from "#/modules/common/dto/validators/satisfies.ts";
import { ReleaseStatus } from "#/modules/source/release-status.enum.ts";
import type { Id } from "#/modules/shared/id.type.ts";
import type { IdentityCode } from "#/modules/shared/identity-code.type.ts";
import type { JsonText } from "#/modules/shared/json-text.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/non-empty-string100.type.ts";
import type { PositiveInteger } from "#/modules/shared/positive-integer.type.ts";
import type { Sha256 } from "#/modules/shared/sha256.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/**
 * Pinned approved manifest content; schema and capabilities are immutable release inputs. (entity)
 */
export class ManifestReleasesDto {

  @IsISO8601({})
  approvedAt!: Instant;

  @IsString()
  @IsJSON()
  approvedBySnapshot!: JsonText;

  @IsString()
  @Length(64, 64)
  @Matches(new RegExp("^[a-f0-9]{64}$"))
  contentHash!: Sha256;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsISO8601({})
  @Satisfies<ManifestReleasesDto>((object) => object.effectiveFrom == null || object.effectiveUntil == null || object.effectiveFrom < object.effectiveUntil, {
    message: "Effective Window Is Ordered",
  })
  effectiveFrom!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.effectiveUntil !== null)
  @IsISO8601({})
  effectiveUntil?: Instant | null;

  @IsString()
  @IsUUID()
  fileVersionId!: Id;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(new RegExp("^[a-z0-9][a-z0-9_]*(\\.[a-z0-9][a-z0-9_]*){0,15}$"))
  inputSchemaCode!: IdentityCode;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  inputSchemaVersion!: NonEmptyString100;

  @IsString()
  @IsUUID()
  manifestId!: Id;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  releaseLabel!: NonEmptyString100;

  @IsString()
  @IsJSON()
  requiredCapabilities!: JsonText;

  @IsEnum(ReleaseStatus)
  status!: ReleaseStatus;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}