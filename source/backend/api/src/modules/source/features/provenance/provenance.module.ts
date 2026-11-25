import { Module, type Type } from "@nestjs/common";
import { ListEvidenceUseCase } from "#/modules/source/features/provenance/use-cases/list-evidence.repository.ts";
import { ListSourcesUseCase } from "#/modules/source/features/provenance/use-cases/list-sources.repository.ts";

import { SourceProvenanceController } from "./provenance.controller.ts";
import { SourceProvenanceService, SourceProvenanceServiceImpl } from "./provenance.service.ts";

@Module({
  controllers: [SourceProvenanceController],
  providers: [
    {
      provide: SourceProvenanceService,
      useClass: SourceProvenanceServiceImpl satisfies Type<SourceProvenanceService>,
    },
    ListEvidenceUseCase,
    ListSourcesUseCase,
  ],
  exports: [SourceProvenanceService],
})
export class SourceProvenanceModule {}
