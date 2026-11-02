import { Injectable } from '@nestjs/common';
import type { EntityIdentifierListQueryDto } from '#/modules/entities/dto/entity-identifier-list-query.dto';
import type { EntityIdentifierResponseDto } from '#/modules/entities/dto/entity-identifier-response.dto';
import type { EntityIdentifiersListResponseDto } from '#/modules/entities/dto/entity-identifiers-list-response.dto';
import type { EntityLocationListQueryDto } from '#/modules/entities/dto/entity-location-list-query.dto';
import type { EntityLocationResponseDto } from '#/modules/entities/dto/entity-location-response.dto';
import type { EntityLocationsListResponseDto } from '#/modules/entities/dto/entity-locations-list-response.dto';
import type { EntityOwnershipListQueryDto } from '#/modules/entities/dto/entity-ownership-list-query.dto';
import type { EntityOwnershipResponseDto } from '#/modules/entities/dto/entity-ownership-response.dto';
import type { EntityOwnershipsListResponseDto } from '#/modules/entities/dto/entity-ownerships-list-response.dto';
import type { LegalEntitiesListResponseDto } from '#/modules/entities/dto/legal-entities-list-response.dto';
import type { LegalEntityListQueryDto } from '#/modules/entities/dto/legal-entity-list-query.dto';
import type { LegalEntityResponseDto } from '#/modules/entities/dto/legal-entity-response.dto';
import { FindEntityIdentifiersUseCase } from '#/modules/entities/entities-read/use-cases/find-entity-identifiers.usecase';
import { FindEntityLocationsUseCase } from '#/modules/entities/entities-read/use-cases/find-entity-locations.usecase';
import { FindEntityOwnershipsUseCase } from '#/modules/entities/entities-read/use-cases/find-entity-ownerships.usecase';
import { FindLegalEntitiesUseCase } from '#/modules/entities/entities-read/use-cases/find-legal-entities.usecase';
import { GetEntityIdentifierByIdUseCase } from '#/modules/entities/entities-read/use-cases/get-entity-identifier-by-id.usecase';
import { GetEntityLocationByIdUseCase } from '#/modules/entities/entities-read/use-cases/get-entity-location-by-id.usecase';
import { GetEntityOwnershipByIdUseCase } from '#/modules/entities/entities-read/use-cases/get-entity-ownership-by-id.usecase';
import { GetLegalEntityByIdUseCase } from '#/modules/entities/entities-read/use-cases/get-legal-entity-by-id.usecase';

/**
 * Entities Read: implements the generated EntitiesEntitiesReadService contract by
 * delegating to one use case per operation. The feature module binds it to that contract.
 *
 * Scaffolded by Dryv once; this file belongs to the project. New operations need a method here.
 */
@Injectable()
export class EntitiesEntitiesReadServiceImpl {
  constructor(
    private readonly findEntityIdentifiersUseCase: FindEntityIdentifiersUseCase,
    private readonly findEntityLocationsUseCase: FindEntityLocationsUseCase,
    private readonly findEntityOwnershipsUseCase: FindEntityOwnershipsUseCase,
    private readonly findLegalEntitiesUseCase: FindLegalEntitiesUseCase,
    private readonly getEntityIdentifierByIdUseCase: GetEntityIdentifierByIdUseCase,
    private readonly getEntityLocationByIdUseCase: GetEntityLocationByIdUseCase,
    private readonly getEntityOwnershipByIdUseCase: GetEntityOwnershipByIdUseCase,
    private readonly getLegalEntityByIdUseCase: GetLegalEntityByIdUseCase,
  ) {}

  /** List entity identifiers. */
  findEntityIdentifiers(input: EntityIdentifierListQueryDto) {
    return this.findEntityIdentifiersUseCase.execute(input);
  }

  /** List entity locations. */
  findEntityLocations(input: EntityLocationListQueryDto) {
    return this.findEntityLocationsUseCase.execute(input);
  }

  /** List entity ownerships. */
  findEntityOwnerships(input: EntityOwnershipListQueryDto) {
    return this.findEntityOwnershipsUseCase.execute(input);
  }

  /** List legal entities. */
  findLegalEntities(input: LegalEntityListQueryDto) {
    return this.findLegalEntitiesUseCase.execute(input);
  }

  /** Get entity identifiers by id. */
  getEntityIdentifierById(input: { identifierId: string }) {
    return this.getEntityIdentifierByIdUseCase.execute(input);
  }

  /** Get entity locations by id. */
  getEntityLocationById(input: { locationId: string }) {
    return this.getEntityLocationByIdUseCase.execute(input);
  }

  /** Get entity ownerships by id. */
  getEntityOwnershipById(input: { ownershipId: string }) {
    return this.getEntityOwnershipByIdUseCase.execute(input);
  }

  /** Get legal entities by id. */
  getLegalEntityById(input: { entityId: string }) {
    return this.getLegalEntityByIdUseCase.execute(input);
  }
}