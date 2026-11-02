import { Module, type Type } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LegalAmendmentChangeEntity } from "#/modules/legal/entities/legal-amendment-change.entity.ts";
import { LegalAmendmentEntity } from "#/modules/legal/entities/legal-amendment.entity.ts";
import { LegalAuthorityLinkEntity } from "#/modules/legal/entities/legal-authority-link.entity.ts";
import { LegalInstrumentEntity } from "#/modules/legal/entities/legal-instrument.entity.ts";
import { LegalProvisionEntity } from "#/modules/legal/entities/legal-provision.entity.ts";
import { JurisdictionEntity } from "#/modules/reference/entities/jurisdiction.entity.ts";
import { LegalLegalReadServiceImpl } from "#/modules/legal/legal-read/legal-read.service.impl.ts";
import { FindLegalAmendmentChangesUseCase } from "#/modules/legal/legal-read/use-cases/find-legal-amendment-changes.usecase.ts";
import { FindLegalAmendmentsUseCase } from "#/modules/legal/legal-read/use-cases/find-legal-amendments.usecase.ts";
import { FindLegalAuthorityLinksUseCase } from "#/modules/legal/legal-read/use-cases/find-legal-authority-links.usecase.ts";
import { FindLegalInstrumentsUseCase } from "#/modules/legal/legal-read/use-cases/find-legal-instruments.usecase.ts";
import { FindLegalProvisionsUseCase } from "#/modules/legal/legal-read/use-cases/find-legal-provisions.usecase.ts";
import { GetLegalAmendmentByIdUseCase } from "#/modules/legal/legal-read/use-cases/get-legal-amendment-by-id.usecase.ts";
import { GetLegalAmendmentChangeByIdUseCase } from "#/modules/legal/legal-read/use-cases/get-legal-amendment-change-by-id.usecase.ts";
import { GetLegalAuthorityLinkByIdUseCase } from "#/modules/legal/legal-read/use-cases/get-legal-authority-link-by-id.usecase.ts";
import { GetLegalInstrumentByIdUseCase } from "#/modules/legal/legal-read/use-cases/get-legal-instrument-by-id.usecase.ts";
import { GetLegalProvisionByIdUseCase } from "#/modules/legal/legal-read/use-cases/get-legal-provision-by-id.usecase.ts";

import { LegalLegalReadController } from "./legal-read.controller.ts";
import { LegalLegalReadService } from "./legal-read.service.ts";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LegalAmendmentChangeEntity,
      LegalAmendmentEntity,
      LegalAuthorityLinkEntity,
      LegalInstrumentEntity,
      LegalProvisionEntity,
      JurisdictionEntity,
    ]),
  ],
  controllers: [LegalLegalReadController],
  providers: [
    {
      provide: LegalLegalReadService,
      useClass: LegalLegalReadServiceImpl satisfies Type<LegalLegalReadService>,
    },
    FindLegalAmendmentChangesUseCase,
    FindLegalAmendmentsUseCase,
    FindLegalAuthorityLinksUseCase,
    FindLegalInstrumentsUseCase,
    FindLegalProvisionsUseCase,
    GetLegalAmendmentByIdUseCase,
    GetLegalAmendmentChangeByIdUseCase,
    GetLegalAuthorityLinkByIdUseCase,
    GetLegalInstrumentByIdUseCase,
    GetLegalProvisionByIdUseCase,
  ],
  exports: [LegalLegalReadService],
})
export class LegalLegalReadModule {}