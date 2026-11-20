import {
  IsEnum,
  IsInt,
  IsISO8601,
  IsJSON,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Matches,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";

import { Satisfies } from "#/modules/common/schema/dto/validators/satisfies.ts";
import { SubjectTable } from "#/modules/shared/schema/enum/subject-table.enum.ts";
import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { JsonText } from "#/modules/shared/schema/type/json-text.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Url } from "#/modules/shared/schema/type/url.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * One use of a stored media file by one subject record, which it mentions by table and id. A subject can have many media of any kind and one file can serve many subjects; subjects carry no media pointer. (entity)
 */
export class MediaDto {
  @IsOptional()
  @ValidateIf((object) => object.altText !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  altText?: NonEmptyString500 | null;

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
  @ValidateIf((object) => object.description !== null)
  @IsString()
  @MaxLength(4000)
  description?: Description | null;

  @IsOptional()
  @ValidateIf((object) => object.endSecond !== null)
  @IsInt()
  @Min(0)
  endSecond?: NonNegativeInteger | null;

  @IsOptional()
  @ValidateIf((object) => object.externalUrl !== null)
  @IsString()
  @IsUrl()
  @MaxLength(2048)
  externalUrl?: Url | null;

  @IsOptional()
  @ValidateIf((object) => object.fileVersionId !== null)
  @IsString()
  @IsUUID()
  @Satisfies<MediaDto>((object) => object.fileVersionId != null || object.externalUrl != null, {
    message: "Media Has Bytes Or Url",
  })
  fileVersionId?: Id | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @IsUUID()
  kindId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.metadata !== null)
  @IsString()
  @IsJSON()
  metadata?: JsonText | null;

  @IsOptional()
  @ValidateIf((object) => object.platformId !== null)
  @IsString()
  @IsUUID()
  platformId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.position !== null)
  @IsInt()
  @Min(0)
  position?: NonNegativeInteger | null;

  @IsOptional()
  @ValidateIf((object) => object.purpose !== null)
  @IsString()
  @MaxLength(4000)
  purpose?: Description | null;

  @IsOptional()
  @ValidateIf((object) => object.startSecond !== null)
  @IsInt()
  @Min(0)
  @Satisfies<MediaDto>(
    (object) =>
      object.startSecond == null ||
      object.endSecond == null ||
      object.startSecond < object.endSecond,
    {
      message: "Media Seconds Are Ordered",
    },
  )
  startSecond?: NonNegativeInteger | null;

  @IsString()
  @IsUUID()
  subjectId!: Id;

  @IsEnum(SubjectTable)
  subjectTable!: SubjectTable;

  @IsOptional()
  @ValidateIf((object) => object.thumbnailUrl !== null)
  @IsString()
  @IsUrl()
  @MaxLength(2048)
  thumbnailUrl?: Url | null;

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
