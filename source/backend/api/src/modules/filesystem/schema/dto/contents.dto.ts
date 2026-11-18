import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";
import { SubjectTable } from "#/modules/shared/schema/enum/subject-table.enum.ts";
import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { NonEmptyString } from "#/modules/shared/schema/type/non-empty-string.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * One authored text (markdown) about a subject record: an institution, a place, a person, the Constitution or general knowledge. Media is referenced, never embedded. (entity)
 */
export class ContentsDto {
  @IsString()
  @MinLength(1)
  body!: NonEmptyString;

  @IsString()
  @IsUUID()
  categoryId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.classificationId !== null)
  @IsString()
  @IsUUID()
  classificationId?: Id | null;

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

  @IsOptional()
  @ValidateIf((object) => object.fileVersionId !== null)
  @IsString()
  @IsUUID()
  fileVersionId?: Id | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsBoolean()
  isDevelopmentText!: Flag;

  @IsString()
  @IsUUID()
  languageId!: Id;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  slug!: NonEmptyString255;

  @IsString()
  @IsUUID()
  subjectId!: Id;

  @IsEnum(SubjectTable)
  subjectTable!: SubjectTable;

  @IsOptional()
  @ValidateIf((object) => object.summary !== null)
  @IsString()
  @MaxLength(4000)
  summary?: Description | null;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  title!: Name;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
