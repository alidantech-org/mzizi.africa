import {
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
  ValidateIf,
} from "class-validator";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Sha256 } from "#/modules/shared/schema/type/sha256.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * A counted view, kept for a limited time. (entity)
 *
 * Invariant "ViewHasOneSubject" has no simple form, so it isn't validated here.
 */
export class ViewsDto {
  @IsOptional()
  @ValidateIf((object) => object.articleId !== null)
  @IsString()
  @IsUUID()
  articleId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.countryId !== null)
  @IsString()
  @IsUUID()
  countryId?: Id | null;

  @IsISO8601({})
  createdAt!: Instant;

  @IsISO8601({ strict: true })
  day!: CalendarDate;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.identityId !== null)
  @IsString()
  @IsUUID()
  identityId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.postCountryId !== null)
  @IsString()
  @IsUUID()
  postCountryId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.postId !== null)
  @IsString()
  @IsUUID()
  postId?: Id | null;

  @IsString()
  @Length(64, 64)
  @Matches(new RegExp("^[a-f0-9]{64}$"))
  visitorHash!: Sha256;
}
