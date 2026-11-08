import { Module, type Type } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EntityIdentifierEntity } from "#/modules/entities/entities/entity-identifier.entity.ts";
import { EntityOwnershipEntity } from "#/modules/entities/entities/entity-ownership.entity.ts";
import { LegalEntityEntity } from "#/modules/entities/entities/legal-entity.entity.ts";
import { EntitiesEntitiesReadServiceImpl } from "#/modules/entities/entities-read/entities-read.service.impl.ts";
import { FindEntityIdentifiersUseCase } from "#/modules/entities/entities-read/use-cases/find-entity-identifiers.usecase.ts";
import { FindEntityOwnershipsUseCase } from "#/modules/entities/entities-read/use-cases/find-entity-ownerships.usecase.ts";
import { FindLegalEntitiesUseCase } from "#/modules/entities/entities-read/use-cases/find-legal-entities.usecase.ts";
import { GetEntityIdentifierByIdUseCase } from "#/modules/entities/entities-read/use-cases/get-entity-identifier-by-id.usecase.ts";
import { GetEntityOwnershipByIdUseCase } from "#/modules/entities/entities-read/use-cases/get-entity-ownership-by-id.usecase.ts";
import { GetLegalEntityByIdUseCase } from "#/modules/entities/entities-read/use-cases/get-legal-entity-by-id.usecase.ts";

import { EntitiesEntitiesReadController } from "./entities-read.controller.ts";
import { EntitiesEntitiesReadService } from "./entities-read.service.ts";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EntityIdentifierEntity,
      EntityOwnershipEntity,
      LegalEntityEntity,
    ]),
  ],
  controllers: [EntitiesEntitiesReadController],
  providers: [
    {
      provide: EntitiesEntitiesReadService,
      useClass: EntitiesEntitiesReadServiceImpl satisfies Type<EntitiesEntitiesReadService>,
    },
    FindEntityIdentifiersUseCase,
    FindEntityOwnershipsUseCase,
    FindLegalEntitiesUseCase,
    GetEntityIdentifierByIdUseCase,
    GetEntityOwnershipByIdUseCase,
    GetLegalEntityByIdUseCase,
  ],
  exports: [EntitiesEntitiesReadService],
})
export class EntitiesEntitiesReadModule {}