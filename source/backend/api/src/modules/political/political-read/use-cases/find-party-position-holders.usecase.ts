import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { PartyPositionHolderListQueryDto } from '#/modules/political/dto/party-position-holder-list-query.dto';
import type { PartyPositionHolderPublicDto } from '#/modules/political/dto/party-position-holder-public.dto';
import type { PartyPositionHolderDto } from '#/modules/political/dto/party-position-holder.dto';
import type { PartyPositionHoldersListResponseDto } from '#/modules/political/dto/party-position-holders-list-response.dto';
import type { PartyPositionDto } from '#/modules/political/dto/party-position.dto';
import type { PartyUnitDto } from '#/modules/political/dto/party-unit.dto';
import type { PartyDto } from '#/modules/political/dto/party.dto';
import type { JurisdictionDto } from '#/modules/reference/dto/jurisdiction.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { EvidencedEntityDto } from '#/modules/shared/dto/evidenced-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { PartyPositionHolderEntity } from '#/modules/political/entities/party-position-holder.entity';

/**
 * List party position holders.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of PartyPositionHolderEntity); review it and add business rules here.
 */
@Injectable()
export class FindPartyPositionHoldersUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(PartyPositionHolderEntity);
  }

  private toReadModel(entity: PartyPositionHolderEntity): PartyPositionHolderPublicDto {
    return {
    artifactChecksum: entity.artifactChecksum,
    artifactId: entity.artifactId,
    confidence: entity.confidence,
    createdAt: entity.createdAt,
    id: entity.id,
    isActing: entity.isActing,
    isCurrent: entity.isCurrent,
    licence: entity.licence,
    method: entity.method,
    personId: entity.personId,
    positionId: entity.positionId,
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
    } as unknown as PartyPositionHolderPublicDto;
  }

  async execute(input: PartyPositionHolderListQueryDto): Promise<PartyPositionHoldersListResponseDto> {
    const page = Number(input.page ?? 1);
    const limit = Number(input.limit ?? 20);
    const where: Record<string, unknown> = {};
    if (input.personId !== undefined) where.personId = input.personId;
    if (input.positionId !== undefined) where.positionId = input.positionId;
    const [rows, total] = await this.repository.findAndCount({
      where: where as FindOptionsWhere<PartyPositionHolderEntity>,
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      holders: rows.map((entity) => this.toReadModel(entity)),
    meta: {
      limit: limit,
      page: page,
      total: total,
      totalPages: Math.ceil(total / limit),
    },
    } as unknown as PartyPositionHoldersListResponseDto;
  }
}