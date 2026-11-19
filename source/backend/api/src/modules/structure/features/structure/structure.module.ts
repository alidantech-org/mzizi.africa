import { Module, type Type } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FileExtensionsEntity } from "#/modules/filesystem/schema/entities/file-extensions.entity.ts";
import { FileVersionsEntity } from "#/modules/filesystem/schema/entities/file-versions.entity.ts";
import { FilesEntity } from "#/modules/filesystem/schema/entities/files.entity.ts";
import { FoldersEntity } from "#/modules/filesystem/schema/entities/folders.entity.ts";
import { FeaturesEntity } from "#/modules/geography/schema/entities/features.entity.ts";
import { LevelsEntity } from "#/modules/geography/schema/entities/levels.entity.ts";
import { AssignmentsEntity } from "#/modules/governance/schema/entities/assignments.entity.ts";
import { FunctionsEntity } from "#/modules/governance/schema/entities/functions.entity.ts";
import { InstitutionsEntity } from "#/modules/governance/schema/entities/institutions.entity.ts";
import { OfficesEntity } from "#/modules/governance/schema/entities/offices.entity.ts";
import { PositionsEntity } from "#/modules/governance/schema/entities/positions.entity.ts";
import { PowersEntity } from "#/modules/governance/schema/entities/powers.entity.ts";
import { ProceduresEntity } from "#/modules/governance/schema/entities/procedures.entity.ts";
import { InstrumentsEntity } from "#/modules/legal/schema/entities/instruments.entity.ts";
import { ProvisionsEntity } from "#/modules/legal/schema/entities/provisions.entity.ts";
import { ContactsEntity } from "#/modules/official/schema/entities/contacts.entity.ts";
import { EntitiesEntity } from "#/modules/official/schema/entities/entities.entity.ts";
import { IndividualsEntity } from "#/modules/official/schema/entities/individuals.entity.ts";
import { OfficialNamesEntity } from "#/modules/official/schema/entities/names.entity.ts";
import { CountryEntity } from "#/modules/reference/schema/entities/country.entity.ts";
import { LanguageEntity } from "#/modules/reference/schema/entities/language.entity.ts";
import { PatternEntity } from "#/modules/reference/schema/entities/pattern.entity.ts";
import { SchemeEntity } from "#/modules/reference/schema/entities/scheme.entity.ts";
import { TemplateEntity } from "#/modules/reference/schema/entities/template.entity.ts";
import { TopicEntity } from "#/modules/reference/schema/entities/topic.entity.ts";
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import { AddressesEntity } from "#/modules/source/schema/entities/addresses.entity.ts";
import { ArtifactsEntity } from "#/modules/source/schema/entities/artifacts.entity.ts";
import { CapturesEntity } from "#/modules/source/schema/entities/captures.entity.ts";
import { CitationsEntity } from "#/modules/source/schema/entities/citations.entity.ts";
import { DiscoveriesEntity } from "#/modules/source/schema/entities/discoveries.entity.ts";
import { DomainsEntity } from "#/modules/source/schema/entities/domains.entity.ts";
import { SourceEditionsEntity } from "#/modules/source/schema/entities/editions.entity.ts";
import { ProductsEntity } from "#/modules/source/schema/entities/products.entity.ts";
import { PublishersEntity } from "#/modules/source/schema/entities/publishers.entity.ts";
import { SourcesEntity } from "#/modules/source/schema/entities/sources.entity.ts";
import { StructureStructureRepository } from "#/modules/structure/features/structure/repositories/structure.repository.ts";
import { GetCountryContextUseCase } from "#/modules/structure/features/structure/use-cases/get-country-context.usecase.ts";
import { GetStructureScreenUseCase } from "#/modules/structure/features/structure/use-cases/get-structure-screen.usecase.ts";

import { StructureStructureController } from "./structure.controller.ts";
import { StructureStructureService, StructureStructureServiceImpl } from "./structure.service.ts";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FileExtensionsEntity,
      FileVersionsEntity,
      FilesEntity,
      FoldersEntity,
      FeaturesEntity,
      LevelsEntity,
      AssignmentsEntity,
      FunctionsEntity,
      InstitutionsEntity,
      OfficesEntity,
      PositionsEntity,
      PowersEntity,
      ProceduresEntity,
      InstrumentsEntity,
      ProvisionsEntity,
      ContactsEntity,
      EntitiesEntity,
      IndividualsEntity,
      OfficialNamesEntity,
      CountryEntity,
      LanguageEntity,
      PatternEntity,
      SchemeEntity,
      TemplateEntity,
      TopicEntity,
      ValueEntity,
      AddressesEntity,
      ArtifactsEntity,
      CapturesEntity,
      CitationsEntity,
      DiscoveriesEntity,
      DomainsEntity,
      SourceEditionsEntity,
      ProductsEntity,
      PublishersEntity,
      SourcesEntity,
    ]),
  ],
  controllers: [StructureStructureController],
  providers: [
    {
      provide: StructureStructureService,
      useClass: StructureStructureServiceImpl satisfies Type<StructureStructureService>,
    },
    GetCountryContextUseCase,
    GetStructureScreenUseCase,
    StructureStructureRepository,
  ],
  exports: [StructureStructureService],
})
export class StructureStructureModule {}
