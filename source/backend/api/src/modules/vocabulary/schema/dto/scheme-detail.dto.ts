import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateNested,
} from "class-validator";
import { SchemeDetailLabelsDto } from "#/modules/vocabulary/schema/dto/scheme-detail-labels.dto.ts";
import { SchemeAnswers } from "#/modules/vocabulary/schema/enum/scheme-answers.enum.ts";
import { SchemeShape } from "#/modules/vocabulary/schema/enum/scheme-shape.enum.ts";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";

/**
 * Scheme Detail
 */
export class SchemeDetailDto {
  @IsEnum(SchemeAnswers)
  answers!: SchemeAnswers;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  code!: IdentityCode;

  @IsBoolean()
  isOpen!: Flag;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => SchemeDetailLabelsDto)
  labels!: SchemeDetailLabelsDto[];

  @IsString()
  @IsUUID()
  schemeId!: Id;

  @IsEnum(SchemeShape)
  shape!: SchemeShape;
}
