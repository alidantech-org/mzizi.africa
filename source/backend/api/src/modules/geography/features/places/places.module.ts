import { Module, type Type } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FileExtensionsEntity } from "#/modules/filesystem/schema/entities/file-extensions.entity.ts";
import { FileVersionsEntity } from "#/modules/filesystem/schema/entities/file-versions.entity.ts";
import { FilesEntity } from "#/modules/filesystem/schema/entities/files.entity.ts";
import { FoldersEntity } from "#/modules/filesystem/schema/entities/folders.entity.ts";
import { FeaturesEntity } from "#/modules/geography/schema/entities/features.entity.ts";
import { GeographyNamesEntity } from "#/modules/geography/schema/entities/names.entity.ts";
import { EntitiesEntity } from "#/modules/official/schema/entities/entities.entity.ts";
import { CountryEntity } from "#/modules/reference/schema/entities/country.entity.ts";
import { SchemeEntity } from "#/modules/reference/schema/entities/scheme.entity.ts";
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import { CapturesEntity } from "#/modules/source/schema/entities/captures.entity.ts";
import { CitationsEntity } from "#/modules/source/schema/entities/citations.entity.ts";
import { DocumentsEntity } from "#/modules/source/schema/entities/documents.entity.ts";
import { EvidenceEntity } from "#/modules/source/schema/entities/evidence.entity.ts";
import { ManifestReleasesEntity } from "#/modules/source/schema/entities/manifest-releases.entity.ts";
import { ManifestsEntity } from "#/modules/source/schema/entities/manifests.entity.ts";
import { PublishersEntity } from "#/modules/source/schema/entities/publishers.entity.ts";
import { SourcesEntity } from "#/modules/source/schema/entities/sources.entity.ts";
import { GeographyPlacesRepository } from "#/modules/geography/features/places/repositories/places.repository.ts";
import { BrowseFeaturesUseCase } from "#/modules/geography/features/places/use-cases/browse-features.usecase.ts";
import { GetFeatureUseCase } from "#/modules/geography/features/places/use-cases/get-feature.usecase.ts";

import { GeographyPlacesController } from "./places.controller.ts";
import { GeographyPlacesService, GeographyPlacesServiceImpl } from "./places.service.ts";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FileExtensionsEntity,
      FileVersionsEntity,
      FilesEntity,
      FoldersEntity,
      FeaturesEntity,
      GeographyNamesEntity,
      EntitiesEntity,
      CountryEntity,
      SchemeEntity,
      ValueEntity,
      CapturesEntity,
      CitationsEntity,
      DocumentsEntity,
      EvidenceEntity,
      ManifestReleasesEntity,
      ManifestsEntity,
      PublishersEntity,
      SourcesEntity,
    ]),
  ],
  controllers: [GeographyPlacesController],
  providers: [
    {
      provide: GeographyPlacesService,
      useClass: GeographyPlacesServiceImpl satisfies Type<GeographyPlacesService>,
    },
    BrowseFeaturesUseCase,
    GetFeatureUseCase,
    GeographyPlacesRepository,
  ],
  exports: [GeographyPlacesService],
})
export class GeographyPlacesModule {}
