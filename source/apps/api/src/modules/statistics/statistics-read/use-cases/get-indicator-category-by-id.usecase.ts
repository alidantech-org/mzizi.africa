import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { IndicatorCategoryPublicDto } from '#/modules/statistics/dto/indicator-category-public.dto';
import type { IndicatorCategoryResponseDto } from '#/modules/statistics/dto/indicator-category-response.dto';
import type { IndicatorCategoryDto } from '#/modules/statistics/dto/indicator-category.dto';
import { IndicatorCategoryEntity } from '#/modules/statistics/entities/indicator-category.entity';

/**
 * Get indicator categories by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of IndicatorCategoryEntity); review it and add business rules here.
 */
@Injectable()
export class GetIndicatorCategoryByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(IndicatorCategoryEntity);
  }

  private toReadModel(entity: IndicatorCategoryEntity): IndicatorCategoryPublicDto {
    return {
    code: entity.code,
    createdAt: entity.createdAt,
    id: entity.id,
    isCurrent: entity.isCurrent,
    label: entity.label,
    parentId: entity.parentId,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    version: entity.version,
    } as unknown as IndicatorCategoryPublicDto;
  }

  async execute(input: { categoryId: string }): Promise<IndicatorCategoryResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.categoryId } as never);
    if (!entity) throw new NotFoundException('IndicatorCategory not found');
    return {
      category: this.toReadModel(entity),
    } as unknown as IndicatorCategoryResponseDto;
  }
}