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
import type { JurisdictionDto } from '#/modules/reference/dto/jurisdiction.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { EvidencedEntityDto } from '#/modules/shared/dto/evidenced-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { ElectionResultEntity } from '#/modules/elections/entities/election-result.entity';

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
    artifactChecksum: entity.artifactChecksum,
    artifactId: entity.artifactId,
    candidateId: entity.candidateId,
    confidence: entity.confidence,
    createdAt: entity.createdAt,
    declaredAt: entity.declaredAt,
    declaringInstitutionId: entity.declaringInstitutionId,
    geoUnitId: entity.geoUnitId,
    id: entity.id,
    isCurrent: entity.isCurrent,
    isWinner: entity.isWinner,
    licence: entity.licence,
    method: entity.method,
    rank: entity.rank,
    resultLevelId: entity.resultLevelId,
    retrievedAt: entity.retrievedAt,
    seatId: entity.seatId,
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
    votes: entity.votes,
    } as unknown as ElectionResultPublicDto;
  }

  async execute(input: ElectionResultListQueryDto): Promise<ElectionResultsListResponseDto> {
    const page = Number(input.page ?? 1);
    const limit = Number(input.limit ?? 20);
    const where: Record<string, unknown> = {};
    if (input.candidateId !== undefined) where.candidateId = input.candidateId;
    if (input.geoUnitId !== undefined) where.geoUnitId = input.geoUnitId;
    if (input.resultLevelId !== undefined) where.resultLevelId = input.resultLevelId;
    if (input.seatId !== undefined) where.seatId = input.seatId;
    const [rows, total] = await this.repository.findAndCount({
      where: where as FindOptionsWhere<ElectionResultEntity>,
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      results: rows.map((entity) => this.toReadModel(entity)),
    meta: {
      limit: limit,
      page: page,
      total: total,
      totalPages: Math.ceil(total / limit),
    },
    } as unknown as ElectionResultsListResponseDto;
  }
}