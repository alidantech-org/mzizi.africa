import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { EvidencedEntityDto } from '#/modules/shared/dto/evidenced-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PeriodPublicDto } from '#/modules/statistics/dto/period-public.dto';
import type { PeriodResponseDto } from '#/modules/statistics/dto/period-response.dto';
import type { PeriodDto } from '#/modules/statistics/dto/period.dto';
import { PeriodEntity } from '#/modules/statistics/entities/period.entity';

/**
 * Get periods by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of PeriodEntity); review it and add business rules here.
 */
@Injectable()
export class GetPeriodByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(PeriodEntity);
  }

  private toReadModel(entity: PeriodEntity): PeriodPublicDto {
    return {
    artifactChecksum: entity.artifactChecksum,
    artifactId: entity.artifactId,
    code: entity.code,
    confidence: entity.confidence,
    createdAt: entity.createdAt,
    endsOn: entity.endsOn,
    granularity: entity.granularity,
    id: entity.id,
    isCurrent: entity.isCurrent,
    licence: entity.licence,
    method: entity.method,
    retrievedAt: entity.retrievedAt,
    sourceName: entity.sourceName,
    sourceReference: entity.sourceReference,
    sourceUrl: entity.sourceUrl,
    startsOn: entity.startsOn,
    toolOrModel: entity.toolOrModel,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    verificationState: entity.verificationState,
    version: entity.version,
    } as unknown as PeriodPublicDto;
  }

  async execute(input: { periodId: string }): Promise<PeriodResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.periodId } as never);
    if (!entity) throw new NotFoundException('Period not found');
    return {
      period: this.toReadModel(entity),
    } as unknown as PeriodResponseDto;
  }
}