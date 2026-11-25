import { IsString, IsUUID } from "class-validator";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";

/**
 * Project Detail Sites
 */
export class ProjectDetailSitesDto {
  @IsString()
  @IsUUID()
  featureId!: Id;

  @IsString()
  @IsUUID()
  kindTerm!: Id;
}
