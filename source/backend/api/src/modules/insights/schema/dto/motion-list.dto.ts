import { Allow, IsArray } from "class-validator";

/**
 * Motion List
 */
export class MotionListDto {
  @IsArray()
  @Allow()
  motions!: Record<string, unknown>[];
}
