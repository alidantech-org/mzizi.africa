import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { EntityLocationPublicDto } from '#/modules/entities/dto/entity-location-public.dto';
import type { EntityLocationResponseDto } from '#/modules/entities/dto/entity-location-response.dto';
import type { EntityLocationDto } from '#/modules/entities/dto/entity-location.dto';
import type { LegalEntityDto } from '#/modules/entities/dto/legal-entity.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import { EntityLocationEntity } from '#/modules/entities/entities/entity-location.entity';

/**
 * Get entity locations by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of EntityLocationEntity); review it and add business rules here.
 */
@Injectable()
export class GetEntityLocationByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(EntityLocationEntity);
  }

  private toReadModel(entity: EntityLocationEntity): EntityLocationPublicDto {
    return {
    addressText: entity.addressText,
    createdAt: entity.createdAt,
    entityId: entity.entityId,
    geoUnitId: entity.geoUnitId,
    id: entity.id,
    isCurrent: entity.isCurrent,
    kindId: entity.kindId,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    version: entity.version,
    } as unknown as EntityLocationPublicDto;
  }

  async execute(input: { locationId: string }): Promise<EntityLocationResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.locationId } as never);
    if (!entity) throw new NotFoundException('Location not found');
    return {
      location: this.toReadModel(entity),
    } as unknown as EntityLocationResponseDto;
  }
}