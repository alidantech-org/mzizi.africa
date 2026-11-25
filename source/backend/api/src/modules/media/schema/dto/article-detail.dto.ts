import { Type } from "class-transformer";
import {
  IsArray,
  IsISO8601,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { ArticleDetailTextsDto } from "#/modules/media/schema/dto/article-detail-texts.dto.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * Article Detail
 */
export class ArticleDetailDto {
  @IsString()
  @IsUUID()
  articleId!: Id;

  @IsString()
  @IsUUID()
  categoryTerm!: Id;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  code!: IdentityCode;

  @ValidateIf((object) => object.identityId !== null)
  @IsString()
  @IsUUID()
  identityId!: Id | null;

  @ValidateIf((object) => object.publishedAt !== null)
  @IsISO8601({})
  publishedAt!: Instant | null;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => ArticleDetailTextsDto)
  texts!: ArticleDetailTextsDto[];
}
