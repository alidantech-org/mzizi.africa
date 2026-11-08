import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { PublicServicePublicDto } from '#/modules/services/dto/public-service-public.dto';
import type { PublicServiceResponseDto } from '#/modules/services/dto/public-service-response.dto';
import type { PublicServiceDto } from '#/modules/services/dto/public-service.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import { PublicServiceEntity } from '#/modules/services/entities/public-service.entity';

/**
 * Get public services by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of PublicServiceEntity); review it and add business rules here.
 */
@Injectable()
export class GetPublicServiceByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(PublicServiceEntity);
  }

  private toReadModel(entity: PublicServiceEntity): PublicServicePublicDto {
    return {
    code: entity.code,
    createdAt: entity.createdAt,
    description: entity.description,
    id: entity.id,
    isCurrent: entity.isCurrent,
    jurisdictionId: entity.jurisdictionId,
    legalBasisId: entity.legalBasisId,
    name: entity.name,
    sectorId: entity.sectorId,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    version: entity.version,
    } as unknown as PublicServicePublicDto;
  }

  async execute(input: { serviceId: string }): Promise<PublicServiceResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.serviceId } as never);
    if (!entity) throw new NotFoundException('PublicService not found');
    return {
      service: this.toReadModel(entity),
    } as unknown as PublicServiceResponseDto;
  }
}