import { Module, type Type } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClassificationRecordEntity } from "#/modules/reference/entities/classification-record.entity.ts";
import { JurisdictionEntity } from "#/modules/reference/entities/jurisdiction.entity.ts";
import { ReferenceReferenceReadServiceImpl } from "#/modules/reference/reference-read/reference-read.service.impl.ts";
import { FindClassificationRecordsUseCase } from "#/modules/reference/reference-read/use-cases/find-classification-records.usecase.ts";
import { FindJurisdictionsUseCase } from "#/modules/reference/reference-read/use-cases/find-jurisdictions.usecase.ts";
import { GetClassificationRecordByIdUseCase } from "#/modules/reference/reference-read/use-cases/get-classification-record-by-id.usecase.ts";
import { GetJurisdictionByIdUseCase } from "#/modules/reference/reference-read/use-cases/get-jurisdiction-by-id.usecase.ts";

import { ReferenceReferenceReadController } from "./reference-read.controller.ts";
import { ReferenceReferenceReadService } from "./reference-read.service.ts";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ClassificationRecordEntity,
      JurisdictionEntity,
    ]),
  ],
  controllers: [ReferenceReferenceReadController],
  providers: [
    {
      provide: ReferenceReferenceReadService,
      useClass: ReferenceReferenceReadServiceImpl satisfies Type<ReferenceReferenceReadService>,
    },
    FindClassificationRecordsUseCase,
    FindJurisdictionsUseCase,
    GetClassificationRecordByIdUseCase,
    GetJurisdictionByIdUseCase,
  ],
  exports: [ReferenceReferenceReadService],
})
export class ReferenceReferenceReadModule {}