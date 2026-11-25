import { Module, type Type } from "@nestjs/common";
import { ListPostsUseCase } from "#/modules/community/features/contributions/use-cases/list-posts.repository.ts";

import { CommunityContributionsController } from "./contributions.controller.ts";
import {
  CommunityContributionsService,
  CommunityContributionsServiceImpl,
} from "./contributions.service.ts";

@Module({
  controllers: [CommunityContributionsController],
  providers: [
    {
      provide: CommunityContributionsService,
      useClass: CommunityContributionsServiceImpl satisfies Type<CommunityContributionsService>,
    },
    ListPostsUseCase,
  ],
  exports: [CommunityContributionsService],
})
export class CommunityContributionsModule {}
