import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { PartyUnitListQueryDto } from '#/modules/political/dto/party-unit-list-query.dto';
import type { PartyUnitPublicDto } from '#/modules/political/dto/party-unit-public.dto';
import type { PartyUnitDto } from '#/modules/political/dto/party-unit.dto';
import type { PartyUnitsListResponseDto } from '#/modules/political/dto/party-units-list-response.dto';
import type { PartyDto } from '#/modules/political/dto/party.dto';
import type { JurisdictionDto } from '#/modules/reference/dto/jurisdiction.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { EvidencedEntityDto } from '#/modules/shared/dto/evidenced-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { PartyUnitEntity } from '#/modules/political/entities/party-unit.entity';
import { listPage } from '#/read/list-page';

/**
 * List party units.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of PartyUnitEntity); review it and add business rules here.
 */
@Injectable()
export class FindPartyUnitsUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(PartyUnitEntity);
  }

  private toReadModel(entity: PartyUnitEntity): PartyUnitPublicDto {
    return {
    artifactChecksum: entity.artifactChecksum,
    artifactId: entity.artifactId,
    code: entity.code,
    confidence: entity.confidence,
    createdAt: entity.createdAt,
    geoUnitId: entity.geoUnitId,
    id: entity.id,
    isCurrent: entity.isCurrent,
    levelId: entity.levelId,
    licence: entity.licence,
    method: entity.method,
    name: entity.name,
    parentUnitId: entity.parentUnitId,
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
    } as unknown as PartyUnitPublicDto;
  }

  async execute(input: PartyUnitListQueryDto): Promise<PartyUnitsListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { units: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as PartyUnitsListResponseDto;
  }
}
