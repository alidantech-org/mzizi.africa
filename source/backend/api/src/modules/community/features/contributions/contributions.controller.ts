import { Controller, Get, HttpCode, Query } from "@nestjs/common";
import { IdentityPostsDto } from "#/modules/community/schema/dto/identity-posts.dto.ts";
import { PostCollectionDto } from "#/modules/community/schema/dto/post-collection.dto.ts";
import { CommunityContributionsService } from "./contributions.service.ts";

@Controller()
export class CommunityContributionsController {
  constructor(private readonly service: CommunityContributionsService) {}

  @Get("/v1/community/posts")
  @HttpCode(200)
  listPosts(@Query() input: IdentityPostsDto): Promise<PostCollectionDto> {
    return this.service.listPosts(input);
  }
}
