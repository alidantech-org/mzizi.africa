import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { LegalEntityPublicDto } from '#/modules/entities/dto/legal-entity-public.dto';
import type { LegalEntityResponseDto } from '#/modules/entities/dto/legal-entity-response.dto';
import type { LegalEntityDto } from '#/modules/entities/dto/legal-entity.dto';
import type { JurisdictionDto } from '#/modules/reference/dto/jurisdiction.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { EvidencedEntityDto } from '#/modules/shared/dto/evidenced-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import { LegalEntityEntity } from '#/modules/entities/entities/legal-entity.entity';

/**
 * Get legal entities by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of LegalEntityEntity); review it and add business rules here.
 */
@Injectable()
export class GetLegalEntityByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(LegalEntityEntity);
  }

  private toReadModel(entity: LegalEntityEntity): LegalEntityPublicDto {
    return {
    artifactChecksum: entity.artifactChecksum,
    artifactId: entity.artifactId,
    code: entity.code,
    confidence: entity.confidence,
    createdAt: entity.createdAt,
    entityTypeId: entity.entityTypeId,
    id: entity.id,
    isCurrent: entity.isCurrent,
    jurisdictionId: entity.jurisdictionId,
    licence: entity.licence,
    method: entity.method,
    officialName: entity.officialName,
    parentEntityId: entity.parentEntityId,
    retrievedAt: entity.retrievedAt,
    sourceName: entity.sourceName,
    sourceReference: entity.sourceReference,
    sourceUrl: entity.sourceUrl,
    status: entity.status,
    toolOrModel: entity.toolOrModel,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    verificationState: entity.verificationState,
    version: entity.version,
    } as unknown as LegalEntityPublicDto;
  }

  async execute(input: { entityId: string }): Promise<LegalEntityResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.entityId } as never);
    if (!entity) throw new NotFoundException('Legal not found');
    return {
      entity: this.toReadModel(entity),
    } as unknown as LegalEntityResponseDto;
  }
}