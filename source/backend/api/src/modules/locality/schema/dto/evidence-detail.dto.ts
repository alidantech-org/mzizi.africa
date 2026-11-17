import { Type } from "class-transformer";
import {
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { EvidenceRefDto } from "#/modules/locality/schema/dto/evidence-ref.dto.ts";
import { MediaRefDto } from "#/modules/locality/schema/dto/media-ref.dto.ts";
import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";

/**
 * Evidence Detail
 */
export class EvidenceDetailDto {
  @IsOptional()
  @ValidateIf((object) => object.editionLabel !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  editionLabel?: Name | null;

  @IsDefined()
  @ValidateNested()
  @Type(() => EvidenceRefDto)
  evidence!: EvidenceRefDto;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => MediaRefDto)
  files!: MediaRefDto[];

  @IsOptional()
  @ValidateIf((object) => object.quotedText !== null)
  @IsString()
  @MaxLength(4000)
  quotedText?: Description | null;

  @IsOptional()
  @ValidateIf((object) => object.sourceCode !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  sourceCode?: IdentityCode | null;

  @IsOptional()
  @ValidateIf((object) => object.sourceId !== null)
  @IsString()
  @IsUUID()
  sourceId?: Id | null;
}
