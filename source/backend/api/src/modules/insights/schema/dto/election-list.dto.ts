import { Allow, IsArray } from "class-validator";

/**
 * Election List
 */
export class ElectionListDto {
  @IsArray()
  @Allow()
  elections!: Record<string, unknown>[];
}
