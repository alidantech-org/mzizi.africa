import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { CandidateListQueryDto } from '#/modules/elections/dto/candidate-list-query.dto';
import type { CandidatePublicDto } from '#/modules/elections/dto/candidate-public.dto';
import type { CandidateDto } from '#/modules/elections/dto/candidate.dto';
import type { CandidatesListResponseDto } from '#/modules/elections/dto/candidates-list-response.dto';
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
import { CandidateEntity } from '#/modules/elections/entities/candidate.entity';

/**
 * List candidates.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of CandidateEntity); review it and add business rules here.
 */
@Injectable()
export class FindCandidatesUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(CandidateEntity);
  }

  private toReadModel(entity: CandidateEntity): CandidatePublicDto {
    return {
    artifactChecksum: entity.artifactChecksum,
    artifactId: entity.artifactId,
    confidence: entity.confidence,
    createdAt: entity.createdAt,
    id: entity.id,
    isCurrent: entity.isCurrent,
    isIndependent: entity.isIndependent,
    licence: entity.licence,
    method: entity.method,
    nominationStatus: entity.nominationStatus,
    partyId: entity.partyId,
    personId: entity.personId,
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
    } as unknown as CandidatePublicDto;
  }

  async execute(input: CandidateListQueryDto): Promise<CandidatesListResponseDto> {
    const page = Number(input.page ?? 1);
    const limit = Number(input.limit ?? 20);
    const where: Record<string, unknown> = {};
    if (input.partyId !== undefined) where.partyId = input.partyId;
    if (input.personId !== undefined) where.personId = input.personId;
    if (input.seatId !== undefined) where.seatId = input.seatId;
    const [rows, total] = await this.repository.findAndCount({
      where: where as FindOptionsWhere<CandidateEntity>,
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      candidates: rows.map((entity) => this.toReadModel(entity)),
    meta: {
      limit: limit,
      page: page,
      total: total,
      totalPages: Math.ceil(total / limit),
    },
    } as unknown as CandidatesListResponseDto;
  }
}