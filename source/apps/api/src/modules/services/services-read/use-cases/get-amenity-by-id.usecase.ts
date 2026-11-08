import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { AmenityPublicDto } from '#/modules/services/dto/amenity-public.dto';
import type { AmenityResponseDto } from '#/modules/services/dto/amenity-response.dto';
import type { AmenityDto } from '#/modules/services/dto/amenity.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import { AmenityEntity } from '#/modules/services/entities/amenity.entity';

/**
 * Get amenities by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of AmenityEntity); review it and add business rules here.
 */
@Injectable()
export class GetAmenityByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(AmenityEntity);
  }

  private toReadModel(entity: AmenityEntity): AmenityPublicDto {
    return {
    code: entity.code,
    createdAt: entity.createdAt,
    id: entity.id,
    isActive: entity.isActive,
    isCurrent: entity.isCurrent,
    jurisdictionId: entity.jurisdictionId,
    name: entity.name,
    sectorId: entity.sectorId,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    version: entity.version,
    } as unknown as AmenityPublicDto;
  }

  async execute(input: { amenityId: string }): Promise<AmenityResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.amenityId } as never);
    if (!entity) throw new NotFoundException('Amenity not found');
    return {
      amenity: this.toReadModel(entity),
    } as unknown as AmenityResponseDto;
  }
}