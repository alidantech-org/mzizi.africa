import { Type } from "class-transformer";
import { IsArray, IsDefined, ValidateNested } from "class-validator";
import { MotionListMotionsDto } from "#/modules/insights/schema/dto/motion-list-motions.dto.ts";

/**
 * Motion List
 */
export class MotionListDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => MotionListMotionsDto)
  motions!: MotionListMotionsDto[];
}
