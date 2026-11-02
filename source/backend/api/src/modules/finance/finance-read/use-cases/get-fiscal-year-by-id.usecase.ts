import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { FiscalYearPublicDto } from '#/modules/finance/dto/fiscal-year-public.dto';
import type { FiscalYearResponseDto } from '#/modules/finance/dto/fiscal-year-response.dto';
import type { FiscalYearDto } from '#/modules/finance/dto/fiscal-year.dto';
import type { JurisdictionDto } from '#/modules/reference/dto/jurisdiction.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { EvidencedEntityDto } from '#/modules/shared/dto/evidenced-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import { FiscalYearEntity } from '#/modules/finance/entities/fiscal-year.entity';

/**
 * Get fiscal years by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of FiscalYearEntity); review it and add business rules here.
 */
@Injectable()
export class GetFiscalYearByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(FiscalYearEntity);
  }

  private toReadModel(entity: FiscalYearEntity): FiscalYearPublicDto {
    return {
    artifactChecksum: entity.artifactChecksum,
    artifactId: entity.artifactId,
    code: entity.code,
    confidence: entity.confidence,
    createdAt: entity.createdAt,
    endsOn: entity.endsOn,
    id: entity.id,
    isCurrent: entity.isCurrent,
    jurisdictionId: entity.jurisdictionId,
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
    } as unknown as FiscalYearPublicDto;
  }

  async execute(input: { fiscalYearId: string }): Promise<FiscalYearResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.fiscalYearId } as never);
    if (!entity) throw new NotFoundException('FiscalYear not found');
    return {
      fiscalYear: this.toReadModel(entity),
    } as unknown as FiscalYearResponseDto;
  }
}