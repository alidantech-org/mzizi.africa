import {
  IsEnum,
  IsInt,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";
import { SubjectTable } from "#/modules/shared/schema/enum/subject-table.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Percentage } from "#/modules/shared/schema/type/percentage.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * Who or what benefits from one project, procurement or contract: a facility, a place, an organisation or a population group, with the kind of benefit. The buyer and the supplier are not beneficiaries; they are separate roles. (entity)
 *
 * Invariant "ExactlyOneSpendingRecord" has no simple form, so it isn't validated here.
 */
export class BeneficiariesDto {
  @IsString()
  @IsUUID()
  benefitKindId!: Id;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  code!: IdentityCode;

  @IsOptional()
  @ValidateIf((object) => object.contractId !== null)
  @IsString()
  @IsUUID()
  contractId?: Id | null;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.procurementId !== null)
  @IsString()
  @IsUUID()
  procurementId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.projectId !== null)
  @IsString()
  @IsUUID()
  projectId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.sharePercent !== null)
  @IsNumber({})
  @Min(0)
  @Max(100)
  sharePercent?: Percentage | null;

  @IsOptional()
  @ValidateIf((object) => object.sourceCitationId !== null)
  @IsString()
  @IsUUID()
  sourceCitationId?: Id | null;

  @IsString()
  @IsUUID()
  subjectId!: Id;

  @IsEnum(SubjectTable)
  subjectTable!: SubjectTable;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
