import { IsString, Matches, MaxLength, MinLength, ValidateIf } from "class-validator";
import type { Title } from "#/modules/media/schema/type/title.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonEmptyString1000 } from "#/modules/shared/schema/type/non-empty-string1000.type.ts";

/**
 * Use Entry Captions
 */
export class UseEntryCaptionsDto {
  @ValidateIf((object) => object.altText !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  altText!: NonEmptyString1000 | null;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  languageCode!: IdentityCode;

  @ValidateIf((object) => object.title !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  title!: Title | null;
}
