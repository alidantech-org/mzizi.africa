import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { EntityOwnershipListQueryDto } from '#/modules/entities/dto/entity-ownership-list-query.dto';
import type { EntityOwnershipPublicDto } from '#/modules/entities/dto/entity-ownership-public.dto';
import type { EntityOwnershipDto } from '#/modules/entities/dto/entity-ownership.dto';
import type { EntityOwnershipsListResponseDto } from '#/modules/entities/dto/entity-ownerships-list-response.dto';
import type { LegalEntityDto } from '#/modules/entities/dto/legal-entity.dto';
import type { JurisdictionDto } from '#/modules/reference/dto/jurisdiction.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { EvidencedEntityDto } from '#/modules/shared/dto/evidenced-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { EntityOwnershipEntity } from '#/modules/entities/entities/entity-ownership.entity';

/**
 * List entity ownerships.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of EntityOwnershipEntity); review it and add business rules here.
 */
@Injectable()
export class FindEntityOwnershipsUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(EntityOwnershipEntity);
  }

  private toReadModel(entity: EntityOwnershipEntity): EntityOwnershipPublicDto {
    return {
    artifactChecksum: entity.artifactChecksum,
    artifactId: entity.artifactId,
    confidence: entity.confidence,
    createdAt: entity.createdAt,
    entityId: entity.entityId,
    id: entity.id,
    isCurrent: entity.isCurrent,
    licence: entity.licence,
    method: entity.method,
    ownerEntityId: entity.ownerEntityId,
    ownerPersonId: entity.ownerPersonId,
    percentage: entity.percentage,
    position: entity.position,
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
    } as unknown as EntityOwnershipPublicDto;
  }

  async execute(input: EntityOwnershipListQueryDto): Promise<EntityOwnershipsListResponseDto> {
    const page = Number(input.page ?? 1);
    const limit = Number(input.limit ?? 20);
    const where: Record<string, unknown> = {};
    if (input.entityId !== undefined) where.entityId = input.entityId;
    if (input.ownerEntityId !== undefined) where.ownerEntityId = input.ownerEntityId;
    if (input.ownerPersonId !== undefined) where.ownerPersonId = input.ownerPersonId;
    const [rows, total] = await this.repository.findAndCount({
      where: where as FindOptionsWhere<EntityOwnershipEntity>,
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      ownerships: rows.map((entity) => this.toReadModel(entity)),
    meta: {
      limit: limit,
      page: page,
      total: total,
      totalPages: Math.ceil(total / limit),
    },
    } as unknown as EntityOwnershipsListResponseDto;
  }
}