import { Type } from "class-transformer";
import { IsArray, IsString, IsDefined, ValidateNested } from "class-validator";
import { MotionDetailMotionContributionsDto } from "#/modules/insights/schema/dto/motion-detail-motion-contributions.dto.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Motion Detail Motion
 */
export class MotionDetailMotionDto {
  @IsString()
  code!: String;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => MotionDetailMotionContributionsDto)
  contributions!: MotionDetailMotionContributionsDto[];

  @IsString()
  heldOn!: String;

  @IsString()
  institution!: String;

  @IsString()
  institutionId!: String;

  @IsString()
  kind!: String;

  @IsString()
  movedBy!: String;

  @IsString()
  outcome!: String;

  @IsString()
  sitting!: String;

  @IsString()
  summary!: String;

  @IsString()
  title!: String;
}
