import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { LegalInstrumentDto } from '#/modules/legal/dto/legal-instrument.dto';
import type { LegalProvisionPublicDto } from '#/modules/legal/dto/legal-provision-public.dto';
import type { LegalProvisionResponseDto } from '#/modules/legal/dto/legal-provision-response.dto';
import type { LegalProvisionDto } from '#/modules/legal/dto/legal-provision.dto';
import type { JurisdictionDto } from '#/modules/reference/dto/jurisdiction.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { EvidencedEntityDto } from '#/modules/shared/dto/evidenced-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import { LegalProvisionEntity } from '#/modules/legal/entities/legal-provision.entity';

/**
 * Get legal provisions by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of LegalProvisionEntity); review it and add business rules here.
 */
@Injectable()
export class GetLegalProvisionByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(LegalProvisionEntity);
  }

  private toReadModel(entity: LegalProvisionEntity): LegalProvisionPublicDto {
    return {
    artifactChecksum: entity.artifactChecksum,
    artifactId: entity.artifactId,
    citation: entity.citation,
    code: entity.code,
    confidence: entity.confidence,
    content: entity.content,
    createdAt: entity.createdAt,
    heading: entity.heading,
    id: entity.id,
    instrumentId: entity.instrumentId,
    isCurrent: entity.isCurrent,
    kind: entity.kind,
    licence: entity.licence,
    method: entity.method,
    parentId: entity.parentId,
    previousVersionId: entity.previousVersionId,
    retrievedAt: entity.retrievedAt,
    sortOrder: entity.sortOrder,
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
    } as unknown as LegalProvisionPublicDto;
  }

  async execute(input: { provisionId: string }): Promise<LegalProvisionResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.provisionId } as never);
    if (!entity) throw new NotFoundException('LegalProvision not found');
    return {
      provision: this.toReadModel(entity),
    } as unknown as LegalProvisionResponseDto;
  }
}