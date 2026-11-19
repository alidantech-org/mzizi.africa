import { Type } from "class-transformer";
import {
  IsArray,
  IsString,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateNested,
} from "class-validator";
import { MotionDetailLegalDto } from "#/modules/insights/schema/dto/motion-detail-legal.dto.ts";
import { MotionDetailMembersDto } from "#/modules/insights/schema/dto/motion-detail-members.dto.ts";
import { MotionDetailMotionDto } from "#/modules/insights/schema/dto/motion-detail-motion.dto.ts";
import { MotionDetailPartiesDto } from "#/modules/insights/schema/dto/motion-detail-parties.dto.ts";
import { MotionDetailTallyDto } from "#/modules/insights/schema/dto/motion-detail-tally.dto.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/**
 * Motion Detail
 */
export class MotionDetailDto {
  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(500, { each: true })
  gaps!: NonEmptyString500[];

  @IsDefined()
  @ValidateNested()
  @Type(() => MotionDetailLegalDto)
  legal!: MotionDetailLegalDto;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => MotionDetailMembersDto)
  members!: MotionDetailMembersDto[];

  @IsDefined()
  @ValidateNested()
  @Type(() => MotionDetailMotionDto)
  motion!: MotionDetailMotionDto;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => MotionDetailPartiesDto)
  parties!: MotionDetailPartiesDto[];

  @IsDefined()
  @ValidateNested()
  @Type(() => MotionDetailTallyDto)
  tally!: MotionDetailTallyDto;
}
