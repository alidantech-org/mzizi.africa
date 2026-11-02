import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { ClassificationRecordPublicDto } from '#/modules/reference/dto/classification-record-public.dto';
import type { ClassificationRecordResponseDto } from '#/modules/reference/dto/classification-record-response.dto';
import type { ClassificationRecordDto } from '#/modules/reference/dto/classification-record.dto';
import type { JurisdictionDto } from '#/modules/reference/dto/jurisdiction.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { EvidencedEntityDto } from '#/modules/shared/dto/evidenced-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import { ClassificationRecordEntity } from '#/modules/reference/entities/classification-record.entity';

/**
 * Get classification records by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of ClassificationRecordEntity); review it and add business rules here.
 */
@Injectable()
export class GetClassificationRecordByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(ClassificationRecordEntity);
  }

  private toReadModel(entity: ClassificationRecordEntity): ClassificationRecordPublicDto {
    return {
    artifactChecksum: entity.artifactChecksum,
    artifactId: entity.artifactId,
    code: entity.code,
    confidence: entity.confidence,
    createdAt: entity.createdAt,
    id: entity.id,
    isCurrent: entity.isCurrent,
    jurisdictionId: entity.jurisdictionId,
    label: entity.label,
    legalBasis: entity.legalBasis,
    licence: entity.licence,
    method: entity.method,
    order: entity.order,
    retrievedAt: entity.retrievedAt,
    scheme: entity.scheme,
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
    } as unknown as ClassificationRecordPublicDto;
  }

  async execute(input: { recordId: string }): Promise<ClassificationRecordResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.recordId } as never);
    if (!entity) throw new NotFoundException('ClassificationRecord not found');
    return {
      record: this.toReadModel(entity),
    } as unknown as ClassificationRecordResponseDto;
  }
}