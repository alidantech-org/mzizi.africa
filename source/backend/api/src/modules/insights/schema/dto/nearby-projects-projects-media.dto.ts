import { IsBoolean, IsOptional, IsString, ValidateIf } from "class-validator";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Nearby Projects Projects Media
 */
export class NearbyProjectsProjectsMediaDto {
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

  @IsOptional()
  @ValidateIf((object) => object.platform !== null)
  @IsString()
  platform?: String | null;

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
