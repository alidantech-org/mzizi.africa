import { Module, type Type } from "@nestjs/common";
import { InteractionsInteractionsRepository } from "#/modules/interactions/features/interactions/repositories/interactions.repository.ts";
import { GetEngagementUseCase } from "#/modules/interactions/features/interactions/use-cases/get-engagement.usecase.ts";
import { LikeUseCase } from "#/modules/interactions/features/interactions/use-cases/like.usecase.ts";
import { RecordViewUseCase } from "#/modules/interactions/features/interactions/use-cases/record-view.usecase.ts";
import { UnlikeUseCase } from "#/modules/interactions/features/interactions/use-cases/unlike.usecase.ts";

import { InteractionsInteractionsController } from "./interactions.controller.ts";
import {
  InteractionsInteractionsService,
  InteractionsInteractionsServiceImpl,
} from "./interactions.service.ts";

@Module({
  controllers: [InteractionsInteractionsController],
  providers: [
    {
      provide: InteractionsInteractionsService,
      useClass: InteractionsInteractionsServiceImpl satisfies Type<InteractionsInteractionsService>,
    },
    GetEngagementUseCase,
    LikeUseCase,
    RecordViewUseCase,
    UnlikeUseCase,
    InteractionsInteractionsRepository,
  ],
  exports: [InteractionsInteractionsService],
})
export class InteractionsInteractionsModule {}
