import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { CandidateDto } from '#/modules/elections/dto/candidate.dto';
import type { ElectionResultListQueryDto } from '#/modules/elections/dto/election-result-list-query.dto';
import type { ElectionResultPublicDto } from '#/modules/elections/dto/election-result-public.dto';
import type { ElectionResultDto } from '#/modules/elections/dto/election-result.dto';
import type { ElectionResultsListResponseDto } from '#/modules/elections/dto/election-results-list-response.dto';
import type { ElectionDto } from '#/modules/elections/dto/election.dto';
import type { SeatDto } from '#/modules/elections/dto/seat.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { ElectionResultEntity } from '#/modules/elections/entities/election-result.entity';
import { listPage } from '#/read/list-page';

/**
 * List election results.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of ElectionResultEntity); review it and add business rules here.
 */
@Injectable()
export class FindElectionResultsUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(ElectionResultEntity);
  }

  private toReadModel(entity: ElectionResultEntity): ElectionResultPublicDto {
    return {
    candidateId: entity.candidateId,
    createdAt: entity.createdAt,
    declaredAt: entity.declaredAt,
    declaringInstitutionId: entity.declaringInstitutionId,
    geoUnitId: entity.geoUnitId,
    id: entity.id,
    isCurrent: entity.isCurrent,
    isWinner: entity.isWinner,
    rank: entity.rank,
    resultLevelId: entity.resultLevelId,
    seatId: entity.seatId,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    version: entity.version,
    votes: entity.votes,
    } as unknown as ElectionResultPublicDto;
  }

  async execute(input: ElectionResultListQueryDto): Promise<ElectionResultsListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { results: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as ElectionResultsListResponseDto;
  }
}
