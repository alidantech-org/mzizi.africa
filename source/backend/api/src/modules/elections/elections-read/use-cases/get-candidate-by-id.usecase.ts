import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { CandidatePublicDto } from '#/modules/elections/dto/candidate-public.dto';
import type { CandidateResponseDto } from '#/modules/elections/dto/candidate-response.dto';
import type { CandidateDto } from '#/modules/elections/dto/candidate.dto';
import type { ElectionDto } from '#/modules/elections/dto/election.dto';
import type { SeatDto } from '#/modules/elections/dto/seat.dto';
import type { JurisdictionDto } from '#/modules/reference/dto/jurisdiction.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { EvidencedEntityDto } from '#/modules/shared/dto/evidenced-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import { CandidateEntity } from '#/modules/elections/entities/candidate.entity';

/**
 * Get candidates by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of CandidateEntity); review it and add business rules here.
 */
@Injectable()
export class GetCandidateByIdUseCase {
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

  async execute(input: { candidateId: string }): Promise<CandidateResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.candidateId } as never);
    if (!entity) throw new NotFoundException('Candidate not found');
    return {
      candidate: this.toReadModel(entity),
    } as unknown as CandidateResponseDto;
  }
}