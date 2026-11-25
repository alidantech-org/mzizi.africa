import { IsString, IsUUID, Matches, MaxLength, MinLength, ValidateIf } from "class-validator";
import type { Heading } from "#/modules/legal/schema/type/heading.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonEmptyString } from "#/modules/shared/schema/type/non-empty-string.type.ts";

/**
 * Provision Entry Wordings
 */
export class ProvisionEntryWordingsDto {
  @IsString()
  @IsUUID()
  editionId!: Id;

  @ValidateIf((object) => object.heading !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  heading!: Heading | null;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  languageCode!: IdentityCode;

  @IsString()
  @MinLength(1)
  text!: NonEmptyString;
}
