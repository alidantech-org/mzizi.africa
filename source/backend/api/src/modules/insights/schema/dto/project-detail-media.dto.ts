import { IsBoolean, IsOptional, IsString, ValidateIf } from "class-validator";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Project Detail Media
 */
export class ProjectDetailMediaDto {
  @IsOptional()
  @ValidateIf((object) => object.embedUrl !== null)
  @IsString()
  embedUrl?: String | null;

  @IsString()
  kind!: String;

  @IsOptional()
  @ValidateIf((object) => object.mimeType !== null)
  @IsString()
  mimeType?: String | null;

  @IsString()
  platform!: String;

  @IsBoolean()
  stored!: Flag;

  @IsOptional()
  @ValidateIf((object) => object.thumbnailUrl !== null)
  @IsString()
  thumbnailUrl?: String | null;

  @IsString()
  title!: String;

  @IsString()
  url!: String;
}
