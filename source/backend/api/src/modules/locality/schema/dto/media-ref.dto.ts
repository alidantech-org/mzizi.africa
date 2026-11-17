import { IsOptional, IsString, IsUUID, MaxLength, MinLength, ValidateIf } from "class-validator";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";
import type { NonEmptyString1000 } from "#/modules/shared/schema/type/non-empty-string1000.type.ts";

/**
 * Media Ref
 */
export class MediaRefDto {
  @IsString()
  @IsUUID()
  fileVersionId!: Id;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  kind!: NonEmptyString100;

  @IsOptional()
  @ValidateIf((object) => object.mimeType !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  mimeType?: NonEmptyString100 | null;

  @IsOptional()
  @ValidateIf((object) => object.title !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  title?: Name | null;

  @IsOptional()
  @ValidateIf((object) => object.url !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  url?: NonEmptyString1000 | null;
}
