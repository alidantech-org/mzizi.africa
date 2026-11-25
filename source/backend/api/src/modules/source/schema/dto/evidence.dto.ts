import {
  IsArray,
  IsEnum,
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

import { SubjectTable } from "#/modules/shared/schema/enum/subject-table.enum.ts";
import { EvidenceMethod } from "#/modules/source/schema/enum/evidence-method.enum.ts";
import { EvidenceRole } from "#/modules/source/schema/enum/evidence-role.enum.ts";
import type { Confidence } from "#/modules/shared/schema/type/confidence.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { ColumnName } from "#/modules/source/schema/type/column-name.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * The provenance linking table: which citation supports, or contradicts, which row. No foreign key on the subject by design; soft-deleted rows keep their evidence. (entity)
 */
export class EvidenceDto {
  @IsString()
  @IsUUID()
  citationId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.confidence !== null)
  @IsNumber({})
  @Min(0)
  @Max(1)
  confidence?: Confidence | null;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.fields !== null)
  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(63, { each: true })
  fields?: ColumnName[] | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsEnum(EvidenceMethod)
  method!: EvidenceMethod;

  @IsOptional()
  @ValidateIf((object) => object.observedAt !== null)
  @IsISO8601({})
  observedAt?: Instant | null;

  @IsISO8601({})
  recordedAt!: Instant;

  @IsEnum(EvidenceRole)
  role!: EvidenceRole;

  @IsString()
  @IsUUID()
  subjectId!: Id;

  @IsEnum(SubjectTable)
  subjectTable!: SubjectTable;
}
