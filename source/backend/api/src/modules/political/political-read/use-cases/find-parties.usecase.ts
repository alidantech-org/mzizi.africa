import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { PartiesListResponseDto } from '#/modules/political/dto/parties-list-response.dto';
import type { PartyListQueryDto } from '#/modules/political/dto/party-list-query.dto';
import type { PartyPublicDto } from '#/modules/political/dto/party-public.dto';
import type { PartyDto } from '#/modules/political/dto/party.dto';
import type { JurisdictionDto } from '#/modules/reference/dto/jurisdiction.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { EvidencedEntityDto } from '#/modules/shared/dto/evidenced-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { PartyEntity } from '#/modules/political/entities/party.entity';
import { listPage } from '#/read/list-page';

/**
 * List parties.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of PartyEntity); review it and add business rules here.
 */
@Injectable()
export class FindPartiesUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(PartyEntity);
  }

  private toReadModel(entity: PartyEntity): PartyPublicDto {
    return {
    abbreviation: entity.abbreviation,
    artifactChecksum: entity.artifactChecksum,
    artifactId: entity.artifactId,
    code: entity.code,
    confidence: entity.confidence,
    createdAt: entity.createdAt,
    id: entity.id,
    isCurrent: entity.isCurrent,
    jurisdictionId: entity.jurisdictionId,
    licence: entity.licence,
    method: entity.method,
    name: entity.name,
    registryAuthorityId: entity.registryAuthorityId,
    registryIdentifier: entity.registryIdentifier,
    retrievedAt: entity.retrievedAt,
    sourceName: entity.sourceName,
    sourceReference: entity.sourceReference,
    sourceUrl: entity.sourceUrl,
    status: entity.status,
    symbolUrl: entity.symbolUrl,
    toolOrModel: entity.toolOrModel,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    verificationState: entity.verificationState,
    version: entity.version,
    } as unknown as PartyPublicDto;
  }

  async execute(input: PartyListQueryDto): Promise<PartiesListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { parties: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as PartiesListResponseDto;
  }
}
