import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { PartyPositionListQueryDto } from '#/modules/political/dto/party-position-list-query.dto';
import type { PartyPositionPublicDto } from '#/modules/political/dto/party-position-public.dto';
import type { PartyPositionDto } from '#/modules/political/dto/party-position.dto';
import type { PartyPositionsListResponseDto } from '#/modules/political/dto/party-positions-list-response.dto';
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
import { PartyPositionEntity } from '#/modules/political/entities/party-position.entity';
import { listPage } from '#/read/list-page';

/**
 * List party positions.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of PartyPositionEntity); review it and add business rules here.
 */
@Injectable()
export class FindPartyPositionsUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(PartyPositionEntity);
  }

  private toReadModel(entity: PartyPositionEntity): PartyPositionPublicDto {
    return {
    artifactChecksum: entity.artifactChecksum,
    artifactId: entity.artifactId,
    code: entity.code,
    confidence: entity.confidence,
    createdAt: entity.createdAt,
    id: entity.id,
    isCurrent: entity.isCurrent,
    licence: entity.licence,
    method: entity.method,
    retrievedAt: entity.retrievedAt,
    sourceName: entity.sourceName,
    sourceReference: entity.sourceReference,
    sourceUrl: entity.sourceUrl,
    title: entity.title,
    toolOrModel: entity.toolOrModel,
    unitId: entity.unitId,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    verificationState: entity.verificationState,
    version: entity.version,
    } as unknown as PartyPositionPublicDto;
  }

  async execute(input: PartyPositionListQueryDto): Promise<PartyPositionsListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { positions: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as PartyPositionsListResponseDto;
  }
}
