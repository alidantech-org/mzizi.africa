import { Type } from "class-transformer";
import {
  IsArray,
  IsEnum,
  IsInt,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
  IsDefined,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { UseEntryCaptionsDto } from "#/modules/media/schema/dto/use-entry-captions.dto.ts";
import { AssetKind } from "#/modules/media/schema/enum/asset-kind.enum.ts";
import type { Pixels } from "#/modules/media/schema/type/pixels.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonEmptyString1000 } from "#/modules/shared/schema/type/non-empty-string1000.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";
import type { Url } from "#/modules/shared/schema/type/url.type.ts";

/**
 * Use Entry
 */
export class UseEntryDto {
  @IsString()
  @IsUUID()
  assetId!: Id;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => UseEntryCaptionsDto)
  captions!: UseEntryCaptionsDto[];

  @ValidateIf((object) => object.embedUrl !== null)
  @IsString()
  @IsUrl()
  @MaxLength(2048)
  embedUrl!: Url | null;

  @ValidateIf((object) => object.externalUrl !== null)
  @IsString()
  @IsUrl()
  @MaxLength(2048)
  externalUrl!: Url | null;

  @ValidateIf((object) => object.height !== null)
  @IsInt()
  @Min(1)
  height!: Pixels | null;

  @IsEnum(AssetKind)
  kind!: AssetKind;

  @IsString()
  @IsUUID()
  kindTerm!: Id;

  @ValidateIf((object) => object.position !== null)
  @IsInt()
  @Min(0)
  position!: NonNegativeInteger | null;

  @IsString()
  @IsUUID()
  purposeTerm!: Id;

  @ValidateIf((object) => object.s3Key !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  s3Key!: NonEmptyString1000 | null;

  @ValidateIf((object) => object.thumbnailUrl !== null)
  @IsString()
  @IsUrl()
  @MaxLength(2048)
  thumbnailUrl!: Url | null;

  @ValidateIf((object) => object.width !== null)
  @IsInt()
  @Min(1)
  width!: Pixels | null;
}
