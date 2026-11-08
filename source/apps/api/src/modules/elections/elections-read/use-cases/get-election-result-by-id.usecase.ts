import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { CandidateDto } from '#/modules/elections/dto/candidate.dto';
import type { ElectionResultPublicDto } from '#/modules/elections/dto/election-result-public.dto';
import type { ElectionResultResponseDto } from '#/modules/elections/dto/election-result-response.dto';
import type { ElectionResultDto } from '#/modules/elections/dto/election-result.dto';
import type { ElectionDto } from '#/modules/elections/dto/election.dto';
import type { SeatDto } from '#/modules/elections/dto/seat.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import { ElectionResultEntity } from '#/modules/elections/entities/election-result.entity';

/**
 * Get election results by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of ElectionResultEntity); review it and add business rules here.
 */
@Injectable()
export class GetElectionResultByIdUseCase {
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

  async execute(input: { resultId: string }): Promise<ElectionResultResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.resultId } as never);
    if (!entity) throw new NotFoundException('ElectionResult not found');
    return {
      result: this.toReadModel(entity),
    } as unknown as ElectionResultResponseDto;
  }
}