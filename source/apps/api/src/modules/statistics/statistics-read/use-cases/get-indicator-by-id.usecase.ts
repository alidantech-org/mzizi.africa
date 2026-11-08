import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { IndicatorCategoryDto } from '#/modules/statistics/dto/indicator-category.dto';
import type { IndicatorPublicDto } from '#/modules/statistics/dto/indicator-public.dto';
import type { IndicatorResponseDto } from '#/modules/statistics/dto/indicator-response.dto';
import type { IndicatorDto } from '#/modules/statistics/dto/indicator.dto';
import { IndicatorEntity } from '#/modules/statistics/entities/indicator.entity';

/**
 * Get indicators by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of IndicatorEntity); review it and add business rules here.
 */
@Injectable()
export class GetIndicatorByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(IndicatorEntity);
  }

  private toReadModel(entity: IndicatorEntity): IndicatorPublicDto {
    return {
    categoryId: entity.categoryId,
    code: entity.code,
    createdAt: entity.createdAt,
    definition: entity.definition,
    id: entity.id,
    isCurrent: entity.isCurrent,
    name: entity.name,
    parentId: entity.parentId,
    unitOfMeasure: entity.unitOfMeasure,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    version: entity.version,
    } as unknown as IndicatorPublicDto;
  }

  async execute(input: { indicatorId: string }): Promise<IndicatorResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.indicatorId } as never);
    if (!entity) throw new NotFoundException('Indicator not found');
    return {
      indicator: this.toReadModel(entity),
    } as unknown as IndicatorResponseDto;
  }
}