import { Module, type Type } from "@nestjs/common";
import { GetSchemeUseCase } from "#/modules/vocabulary/features/terms/use-cases/get-scheme.repository.ts";
import { ListTermsUseCase } from "#/modules/vocabulary/features/terms/use-cases/list-terms.repository.ts";

import { VocabularyTermsController } from "./terms.controller.ts";
import { VocabularyTermsService, VocabularyTermsServiceImpl } from "./terms.service.ts";

@Module({
  controllers: [VocabularyTermsController],
  providers: [
    {
      provide: VocabularyTermsService,
      useClass: VocabularyTermsServiceImpl satisfies Type<VocabularyTermsService>,
    },
    GetSchemeUseCase,
    ListTermsUseCase,
  ],
  exports: [VocabularyTermsService],
})
export class VocabularyTermsModule {}
