import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { EntityOwnershipPublicDto } from '#/modules/entities/dto/entity-ownership-public.dto';
import type { EntityOwnershipResponseDto } from '#/modules/entities/dto/entity-ownership-response.dto';
import type { EntityOwnershipDto } from '#/modules/entities/dto/entity-ownership.dto';
import type { LegalEntityDto } from '#/modules/entities/dto/legal-entity.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import { EntityOwnershipEntity } from '#/modules/entities/entities/entity-ownership.entity';

/**
 * Get entity ownerships by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of EntityOwnershipEntity); review it and add business rules here.
 */
@Injectable()
export class GetEntityOwnershipByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(EntityOwnershipEntity);
  }

  private toReadModel(entity: EntityOwnershipEntity): EntityOwnershipPublicDto {
    return {
    createdAt: entity.createdAt,
    entityId: entity.entityId,
    id: entity.id,
    isCurrent: entity.isCurrent,
    ownerEntityId: entity.ownerEntityId,
    ownerPersonId: entity.ownerPersonId,
    percentage: entity.percentage,
    position: entity.position,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    version: entity.version,
    } as unknown as EntityOwnershipPublicDto;
  }

  async execute(input: { ownershipId: string }): Promise<EntityOwnershipResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.ownershipId } as never);
    if (!entity) throw new NotFoundException('Ownership not found');
    return {
      ownership: this.toReadModel(entity),
    } as unknown as EntityOwnershipResponseDto;
  }
}