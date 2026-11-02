import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { PartyIdeologiesListResponseDto } from '#/modules/political/dto/party-ideologies-list-response.dto';
import type { PartyIdeologyListQueryDto } from '#/modules/political/dto/party-ideology-list-query.dto';
import type { PartyIdeologyPublicDto } from '#/modules/political/dto/party-ideology-public.dto';
import type { PartyIdeologyDto } from '#/modules/political/dto/party-ideology.dto';
import type { PartyDto } from '#/modules/political/dto/party.dto';
import type { JurisdictionDto } from '#/modules/reference/dto/jurisdiction.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { EvidencedEntityDto } from '#/modules/shared/dto/evidenced-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { PartyIdeologyEntity } from '#/modules/political/entities/party-ideology.entity';

/**
 * List party ideologies.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of PartyIdeologyEntity); review it and add business rules here.
 */
@Injectable()
export class FindPartyIdeologiesUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(PartyIdeologyEntity);
  }

  private toReadModel(entity: PartyIdeologyEntity): PartyIdeologyPublicDto {
    return {
    artifactChecksum: entity.artifactChecksum,
    artifactId: entity.artifactId,
    confidence: entity.confidence,
    createdAt: entity.createdAt,
    id: entity.id,
    ideologyId: entity.ideologyId,
    isCurrent: entity.isCurrent,
    licence: entity.licence,
    method: entity.method,
    partyId: entity.partyId,
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
    } as unknown as PartyIdeologyPublicDto;
  }

  async execute(input: PartyIdeologyListQueryDto): Promise<PartyIdeologiesListResponseDto> {
    const page = Number(input.page ?? 1);
    const limit = Number(input.limit ?? 20);
    const where: Record<string, unknown> = {};
    if (input.ideologyId !== undefined) where.ideologyId = input.ideologyId;
    if (input.partyId !== undefined) where.partyId = input.partyId;
    const [rows, total] = await this.repository.findAndCount({
      where: where as FindOptionsWhere<PartyIdeologyEntity>,
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      partyIdeologies: rows.map((entity) => this.toReadModel(entity)),
    meta: {
      limit: limit,
      page: page,
      total: total,
      totalPages: Math.ceil(total / limit),
    },
    } as unknown as PartyIdeologiesListResponseDto;
  }
}