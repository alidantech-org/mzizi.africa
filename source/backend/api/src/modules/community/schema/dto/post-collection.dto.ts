import { Type } from "class-transformer";
import { IsArray, IsDefined, ValidateNested } from "class-validator";
import { PostEntryDto } from "#/modules/community/schema/dto/post-entry.dto.ts";

/**
 * Post Collection
 */
export class PostCollectionDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => PostEntryDto)
  posts!: PostEntryDto[];
}
