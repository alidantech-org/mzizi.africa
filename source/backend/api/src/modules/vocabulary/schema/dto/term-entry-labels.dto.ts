import {
  IsEnum,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from "class-validator";
import { LabelKind } from "#/modules/vocabulary/schema/enum/label-kind.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonEmptyString1000 } from "#/modules/shared/schema/type/non-empty-string1000.type.ts";

/**
 * Term Entry Labels
 */
export class TermEntryLabelsDto {
  @ValidateIf((object) => object.countryId !== null)
  @IsString()
  @IsUUID()
  countryId!: Id | null;

  @IsEnum(LabelKind)
  kind!: LabelKind;

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
  @MaxLength(1000)
  text!: NonEmptyString1000;
}
