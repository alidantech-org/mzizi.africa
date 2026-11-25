import {
  IsEnum,
  IsISO8601,
  IsNumber,
  IsString,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";
import { EvidenceMethod } from "#/modules/source/schema/enum/evidence-method.enum.ts";
import { EvidenceRole } from "#/modules/source/schema/enum/evidence-role.enum.ts";
import type { Confidence } from "#/modules/shared/schema/type/confidence.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";
import type { Locator } from "#/modules/source/schema/type/locator.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * Evidence Entry
 */
export class EvidenceEntryDto {
  @ValidateIf((object) => object.artifactId !== null)
  @IsString()
  @IsUUID()
  artifactId!: Id | null;

  @ValidateIf((object) => object.confidence !== null)
  @IsNumber({})
  @Min(0)
  @Max(1)
  confidence!: Confidence | null;

  @ValidateIf((object) => object.editionDesignation !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  editionDesignation!: NonEmptyString255 | null;

  @IsString()
  @IsUUID()
  evidenceId!: Id;

  @IsString()
  @MinLength(1)
  @MaxLength(4000)
  locator!: Locator;

  @IsString()
  @IsUUID()
  locatorTerm!: Id;

  @IsEnum(EvidenceMethod)
  method!: EvidenceMethod;

  @ValidateIf((object) => object.observedAt !== null)
  @IsISO8601({})
  observedAt!: Instant | null;

  @ValidateIf((object) => object.productCode !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  productCode!: IdentityCode | null;

  @ValidateIf((object) => object.publisherCode !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  publisherCode!: IdentityCode | null;

  @IsEnum(EvidenceRole)
  role!: EvidenceRole;
}
