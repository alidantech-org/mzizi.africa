import { Module, type Type } from "@nestjs/common";
import { GetInstrumentUseCase } from "#/modules/legal/features/law/use-cases/get-instrument.repository.ts";
import { ListEffectsUseCase } from "#/modules/legal/features/law/use-cases/list-effects.repository.ts";
import { ListInstrumentsUseCase } from "#/modules/legal/features/law/use-cases/list-instruments.repository.ts";
import { ListProvisionsUseCase } from "#/modules/legal/features/law/use-cases/list-provisions.repository.ts";

import { LegalLawController } from "./law.controller.ts";
import { LegalLawService, LegalLawServiceImpl } from "./law.service.ts";

@Module({
  controllers: [LegalLawController],
  providers: [
    {
      provide: LegalLawService,
      useClass: LegalLawServiceImpl satisfies Type<LegalLawService>,
    },
    GetInstrumentUseCase,
    ListEffectsUseCase,
    ListInstrumentsUseCase,
    ListProvisionsUseCase,
  ],
  exports: [LegalLawService],
})
export class LegalLawModule {}
