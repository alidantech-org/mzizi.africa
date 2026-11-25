import { Type } from "class-transformer";
import {
  IsArray,
  IsEnum,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { SourceEntryPublisherNamesDto } from "#/modules/source/schema/dto/source-entry-publisher-names.dto.ts";
import { SourceKind } from "#/modules/source/schema/enum/source-kind.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Label } from "#/modules/source/schema/type/label.type.ts";

/**
 * Source Entry
 */
export class SourceEntryDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  code!: IdentityCode;

  @ValidateIf((object) => object.credibilityTerm !== null)
  @IsString()
  @IsUUID()
  credibilityTerm!: Id | null;

  @IsEnum(SourceKind)
  kind!: SourceKind;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  label!: Label;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  publisherCode!: IdentityCode;

  @IsString()
  @IsUUID()
  publisherId!: Id;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => SourceEntryPublisherNamesDto)
  publisherNames!: SourceEntryPublisherNamesDto[];

  @IsString()
  @IsUUID()
  sourceId!: Id;
}
