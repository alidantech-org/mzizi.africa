import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { DimensionPublicDto } from '#/modules/statistics/dto/dimension-public.dto';
import type { DimensionResponseDto } from '#/modules/statistics/dto/dimension-response.dto';
import type { DimensionDto } from '#/modules/statistics/dto/dimension.dto';
import { DimensionEntity } from '#/modules/statistics/entities/dimension.entity';

/**
 * Get dimensions by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of DimensionEntity); review it and add business rules here.
 */
@Injectable()
export class GetDimensionByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(DimensionEntity);
  }

  private toReadModel(entity: DimensionEntity): DimensionPublicDto {
    return {
    code: entity.code,
    createdAt: entity.createdAt,
    description: entity.description,
    id: entity.id,
    isCurrent: entity.isCurrent,
    name: entity.name,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    version: entity.version,
    } as unknown as DimensionPublicDto;
  }

  async execute(input: { dimensionId: string }): Promise<DimensionResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.dimensionId } as never);
    if (!entity) throw new NotFoundException('Dimension not found');
    return {
      dimension: this.toReadModel(entity),
    } as unknown as DimensionResponseDto;
  }
}