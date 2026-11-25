import { Module, type Type } from "@nestjs/common";
import { RecordViewUseCase } from "#/modules/community/features/counting/use-cases/record-view.repository.ts";

import { CommunityCountingController } from "./counting.controller.ts";
import { CommunityCountingService, CommunityCountingServiceImpl } from "./counting.service.ts";

@Module({
  controllers: [CommunityCountingController],
  providers: [
    {
      provide: CommunityCountingService,
      useClass: CommunityCountingServiceImpl satisfies Type<CommunityCountingService>,
    },
    RecordViewUseCase,
  ],
  exports: [CommunityCountingService],
})
export class CommunityCountingModule {}
