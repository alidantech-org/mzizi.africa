import { IsInt, IsISO8601, IsOptional, IsString, IsUUID, Min, ValidateIf } from "class-validator";

import { Satisfies } from "#/modules/common/schema/dto/validators/satisfies.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * One dated, typed relationship between two government institutions. (entity)
 */
export class RelationshipsDto {
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
  @IsUUID()
  objectInstitutionId!: Id;

  @IsString()
  @IsUUID()
  relationshipKindId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.sourceCitationId !== null)
  @IsString()
  @IsUUID()
  sourceCitationId?: Id | null;

  @IsString()
  @IsUUID()
  @Satisfies<RelationshipsDto>(
    (object) => object.subjectInstitutionId !== object.objectInstitutionId,
    {
      message: "Relationship Is Not Self Referential",
    },
  )
  subjectInstitutionId!: Id;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
