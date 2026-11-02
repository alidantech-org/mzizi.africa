import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { EntityIdentifierListQueryDto } from '#/modules/entities/dto/entity-identifier-list-query.dto';
import type { EntityIdentifierPublicDto } from '#/modules/entities/dto/entity-identifier-public.dto';
import type { EntityIdentifierDto } from '#/modules/entities/dto/entity-identifier.dto';
import type { EntityIdentifiersListResponseDto } from '#/modules/entities/dto/entity-identifiers-list-response.dto';
import type { LegalEntityDto } from '#/modules/entities/dto/legal-entity.dto';
import type { JurisdictionDto } from '#/modules/reference/dto/jurisdiction.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { EvidencedEntityDto } from '#/modules/shared/dto/evidenced-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { EntityIdentifierEntity } from '#/modules/entities/entities/entity-identifier.entity';

/**
 * List entity identifiers.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of EntityIdentifierEntity); review it and add business rules here.
 */
@Injectable()
export class FindEntityIdentifiersUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(EntityIdentifierEntity);
  }

  private toReadModel(entity: EntityIdentifierEntity): EntityIdentifierPublicDto {
    return {
    artifactChecksum: entity.artifactChecksum,
    artifactId: entity.artifactId,
    confidence: entity.confidence,
    createdAt: entity.createdAt,
    entityId: entity.entityId,
    id: entity.id,
    isCurrent: entity.isCurrent,
    issuingAuthorityId: entity.issuingAuthorityId,
    licence: entity.licence,
    method: entity.method,
    retrievedAt: entity.retrievedAt,
    schemeId: entity.schemeId,
    sourceName: entity.sourceName,
    sourceReference: entity.sourceReference,
    sourceUrl: entity.sourceUrl,
    toolOrModel: entity.toolOrModel,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    value: entity.value,
    verificationState: entity.verificationState,
    version: entity.version,
    } as unknown as EntityIdentifierPublicDto;
  }

  async execute(input: EntityIdentifierListQueryDto): Promise<EntityIdentifiersListResponseDto> {
    const page = Number(input.page ?? 1);
    const limit = Number(input.limit ?? 20);
    const where: Record<string, unknown> = {};
    if (input.entityId !== undefined) where.entityId = input.entityId;
    if (input.schemeId !== undefined) where.schemeId = input.schemeId;
    const [rows, total] = await this.repository.findAndCount({
      where: where as FindOptionsWhere<EntityIdentifierEntity>,
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      identifiers: rows.map((entity) => this.toReadModel(entity)),
    meta: {
      limit: limit,
      page: page,
      total: total,
      totalPages: Math.ceil(total / limit),
    },
    } as unknown as EntityIdentifiersListResponseDto;
  }
}