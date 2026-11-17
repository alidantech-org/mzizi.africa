import {
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";
import type { Confidence } from "#/modules/shared/schema/type/confidence.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * Evidence Ref
 */
export class EvidenceRefDto {
  @IsOptional()
  @ValidateIf((object) => object.artifactTitle !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  artifactTitle?: Name | null;

  @IsString()
  @IsUUID()
  citationId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.confidence !== null)
  @IsNumber({})
  @Min(0)
  @Max(1)
  confidence?: Confidence | null;

  @IsOptional()
  @ValidateIf((object) => object.locator !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  locator?: NonEmptyString500 | null;

  @IsOptional()
  @ValidateIf((object) => object.publisherName !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  publisherName?: Name | null;

  @IsOptional()
  @ValidateIf((object) => object.retrievedAt !== null)
  @IsISO8601({})
  retrievedAt?: Instant | null;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  sourceName!: Name;

  @IsOptional()
  @ValidateIf((object) => object.verification !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  verification?: NonEmptyString100 | null;
}
