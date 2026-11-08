import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { GeoUnitPublicDto } from '#/modules/geography/dto/geo-unit-public.dto';
import type { GeoUnitResponseDto } from '#/modules/geography/dto/geo-unit-response.dto';
import type { GeoUnitDto } from '#/modules/geography/dto/geo-unit.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import { GeoUnitEntity } from '#/modules/geography/entities/geo-unit.entity';

/**
 * Get a geography unit record with its evidence fields.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of GeoUnitEntity); review it and add business rules here.
 */
@Injectable()
export class GetGeoUnitByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(GeoUnitEntity);
  }

  private toReadModel(entity: GeoUnitEntity): GeoUnitPublicDto {
    return {
    code: entity.code,
    createdAt: entity.createdAt,
    id: entity.id,
    isActive: entity.isActive,
    isCurrent: entity.isCurrent,
    jurisdictionId: entity.jurisdictionId,
    kind: entity.kind,
    levelId: entity.levelId,
    name: entity.name,
    parentId: entity.parentId,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    version: entity.version,
    } as unknown as GeoUnitPublicDto;
  }

  async execute(input: { unitId: string }): Promise<GeoUnitResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.unitId } as never);
    if (!entity) throw new NotFoundException('GeoUnit not found');
    return {
      unit: this.toReadModel(entity),
    } as unknown as GeoUnitResponseDto;
  }
}