import { Module, type Type } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CalendarsEntity } from "#/modules/event/schema/entities/calendars.entity.ts";
import { EventsEntity } from "#/modules/event/schema/entities/events.entity.ts";
import { OccurrencesEntity } from "#/modules/event/schema/entities/occurrences.entity.ts";
import { FileExtensionsEntity } from "#/modules/filesystem/schema/entities/file-extensions.entity.ts";
import { FileVersionsEntity } from "#/modules/filesystem/schema/entities/file-versions.entity.ts";
import { FilesEntity } from "#/modules/filesystem/schema/entities/files.entity.ts";
import { FoldersEntity } from "#/modules/filesystem/schema/entities/folders.entity.ts";
import { BudgetVersionsEntity } from "#/modules/finance/schema/entities/budget-versions.entity.ts";
import { BudgetsEntity } from "#/modules/finance/schema/entities/budgets.entity.ts";
import { FiscalPeriodsEntity } from "#/modules/finance/schema/entities/fiscal-periods.entity.ts";
import { FeaturesEntity } from "#/modules/geography/schema/entities/features.entity.ts";
import { LevelsEntity } from "#/modules/geography/schema/entities/levels.entity.ts";
import { BillsEntity } from "#/modules/governance/schema/entities/bills.entity.ts";
import { HoldersEntity } from "#/modules/governance/schema/entities/holders.entity.ts";
import { InstitutionsEntity } from "#/modules/governance/schema/entities/institutions.entity.ts";
import { MandatesEntity } from "#/modules/governance/schema/entities/mandates.entity.ts";
import { MotionsEntity } from "#/modules/governance/schema/entities/motions.entity.ts";
import { OfficesEntity } from "#/modules/governance/schema/entities/offices.entity.ts";
import { PositionsEntity } from "#/modules/governance/schema/entities/positions.entity.ts";
import { SittingsEntity } from "#/modules/governance/schema/entities/sittings.entity.ts";
import { TermsEntity } from "#/modules/governance/schema/entities/terms.entity.ts";
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
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import { SourceAddressesEntity } from "#/modules/source/schema/entities/addresses.entity.ts";
import { ArtifactsEntity } from "#/modules/source/schema/entities/artifacts.entity.ts";
import { CapturesEntity } from "#/modules/source/schema/entities/captures.entity.ts";
import { CitationsEntity } from "#/modules/source/schema/entities/citations.entity.ts";
import { DiscoveriesEntity } from "#/modules/source/schema/entities/discoveries.entity.ts";
import { DomainsEntity } from "#/modules/source/schema/entities/domains.entity.ts";
import { SourceEditionsEntity } from "#/modules/source/schema/entities/editions.entity.ts";
import { ProductsEntity } from "#/modules/source/schema/entities/products.entity.ts";
import { PublishersEntity } from "#/modules/source/schema/entities/publishers.entity.ts";
import { SourcesEntity } from "#/modules/source/schema/entities/sources.entity.ts";
import { GovernanceInstitutionsRepository } from "#/modules/governance/features/institutions/repositories/institutions.repository.ts";
import { BrowseInstitutionsUseCase } from "#/modules/governance/features/institutions/use-cases/browse-institutions.usecase.ts";
import { GetInstitutionUseCase } from "#/modules/governance/features/institutions/use-cases/get-institution.usecase.ts";
import { GetOfficeUseCase } from "#/modules/governance/features/institutions/use-cases/get-office.usecase.ts";

import { GovernanceInstitutionsController } from "./institutions.controller.ts";
import {
  GovernanceInstitutionsService,
  GovernanceInstitutionsServiceImpl,
} from "./institutions.service.ts";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CalendarsEntity,
      EventsEntity,
      OccurrencesEntity,
      FileExtensionsEntity,
      FileVersionsEntity,
      FilesEntity,
      FoldersEntity,
      BudgetVersionsEntity,
      BudgetsEntity,
      FiscalPeriodsEntity,
      FeaturesEntity,
      LevelsEntity,
      BillsEntity,
      HoldersEntity,
      InstitutionsEntity,
      MandatesEntity,
      MotionsEntity,
      OfficesEntity,
      PositionsEntity,
      SittingsEntity,
      TermsEntity,
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
      ValueEntity,
      SourceAddressesEntity,
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
  controllers: [GovernanceInstitutionsController],
  providers: [
    {
      provide: GovernanceInstitutionsService,
      useClass: GovernanceInstitutionsServiceImpl satisfies Type<GovernanceInstitutionsService>,
    },
    BrowseInstitutionsUseCase,
    GetInstitutionUseCase,
    GetOfficeUseCase,
    GovernanceInstitutionsRepository,
  ],
  exports: [GovernanceInstitutionsService],
})
export class GovernanceInstitutionsModule {}
