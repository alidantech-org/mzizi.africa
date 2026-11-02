import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { EvidencedEntityDto } from '#/modules/shared/dto/evidenced-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { IndicatorCategoryDto } from '#/modules/statistics/dto/indicator-category.dto';
import type { IndicatorColumnPublicDto } from '#/modules/statistics/dto/indicator-column-public.dto';
import type { IndicatorColumnResponseDto } from '#/modules/statistics/dto/indicator-column-response.dto';
import type { IndicatorColumnDto } from '#/modules/statistics/dto/indicator-column.dto';
import type { IndicatorDto } from '#/modules/statistics/dto/indicator.dto';
import { IndicatorColumnEntity } from '#/modules/statistics/entities/indicator-column.entity';

/**
 * Get indicator columns by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of IndicatorColumnEntity); review it and add business rules here.
 */
@Injectable()
export class GetIndicatorColumnByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(IndicatorColumnEntity);
  }

  private toReadModel(entity: IndicatorColumnEntity): IndicatorColumnPublicDto {
    return {
    artifactChecksum: entity.artifactChecksum,
    artifactId: entity.artifactId,
    code: entity.code,
    confidence: entity.confidence,
    createdAt: entity.createdAt,
    dataType: entity.dataType,
    id: entity.id,
    indicatorId: entity.indicatorId,
    isCurrent: entity.isCurrent,
    label: entity.label,
    licence: entity.licence,
    method: entity.method,
    retrievedAt: entity.retrievedAt,
    sourceName: entity.sourceName,
    sourceReference: entity.sourceReference,
    sourceUrl: entity.sourceUrl,
    toolOrModel: entity.toolOrModel,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    verificationState: entity.verificationState,
    version: entity.version,
    } as unknown as IndicatorColumnPublicDto;
  }

  async execute(input: { columnId: string }): Promise<IndicatorColumnResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.columnId } as never);
    if (!entity) throw new NotFoundException('IndicatorColumn not found');
    return {
      column: this.toReadModel(entity),
    } as unknown as IndicatorColumnResponseDto;
  }
}