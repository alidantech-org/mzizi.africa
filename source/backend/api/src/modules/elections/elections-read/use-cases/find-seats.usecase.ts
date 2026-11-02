import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { ElectionDto } from '#/modules/elections/dto/election.dto';
import type { SeatListQueryDto } from '#/modules/elections/dto/seat-list-query.dto';
import type { SeatPublicDto } from '#/modules/elections/dto/seat-public.dto';
import type { SeatDto } from '#/modules/elections/dto/seat.dto';
import type { SeatsListResponseDto } from '#/modules/elections/dto/seats-list-response.dto';
import type { JurisdictionDto } from '#/modules/reference/dto/jurisdiction.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { EvidencedEntityDto } from '#/modules/shared/dto/evidenced-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { SeatEntity } from '#/modules/elections/entities/seat.entity';
import { listPage } from '#/read/list-page';

/**
 * List seats.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of SeatEntity); review it and add business rules here.
 */
@Injectable()
export class FindSeatsUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(SeatEntity);
  }

  private toReadModel(entity: SeatEntity): SeatPublicDto {
    return {
    artifactChecksum: entity.artifactChecksum,
    artifactId: entity.artifactId,
    code: entity.code,
    confidence: entity.confidence,
    createdAt: entity.createdAt,
    electionId: entity.electionId,
    geoUnitId: entity.geoUnitId,
    id: entity.id,
    isCurrent: entity.isCurrent,
    legalBasisId: entity.legalBasisId,
    licence: entity.licence,
    method: entity.method,
    officeId: entity.officeId,
    positions: entity.positions,
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
    } as unknown as SeatPublicDto;
  }

  async execute(input: SeatListQueryDto): Promise<SeatsListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { seats: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as SeatsListResponseDto;
  }
}
