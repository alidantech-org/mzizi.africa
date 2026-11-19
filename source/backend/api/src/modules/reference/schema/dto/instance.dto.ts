import { IsInt, IsISO8601, IsOptional, IsString, IsUUID, Min, ValidateIf } from "class-validator";

import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * The ledger of generated records: which template produced which institution, position, office, site or contact, for which unit, and whether it is still only expected or has been sourced or verified. (entity)
 *
 * Invariant "HasExactlyOneProduct" has no simple form, so it isn't validated here.
 */
export class InstanceDto {
  @IsOptional()
  @ValidateIf((object) => object.contactId !== null)
  @IsString()
  @IsUUID()
  contactId?: Id | null;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsOptional()
  @ValidateIf((object) => object.domainId !== null)
  @IsString()
  @IsUUID()
  domainId?: Id | null;

  @IsISO8601({})
  generatedAt!: Instant;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.institutionId !== null)
  @IsString()
  @IsUUID()
  institutionId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.officeId !== null)
  @IsString()
  @IsUUID()
  officeId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.positionId !== null)
  @IsString()
  @IsUUID()
  positionId?: Id | null;

  @IsString()
  @IsUUID()
  statusId!: Id;

  @IsString()
  @IsUUID()
  templateId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.unitFeatureId !== null)
  @IsString()
  @IsUUID()
  unitFeatureId?: Id | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.verifiedCitationId !== null)
  @IsString()
  @IsUUID()
  verifiedCitationId?: Id | null;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
