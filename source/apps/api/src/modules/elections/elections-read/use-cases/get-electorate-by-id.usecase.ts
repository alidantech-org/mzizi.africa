import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { ElectionDto } from '#/modules/elections/dto/election.dto';
import type { ElectoratePublicDto } from '#/modules/elections/dto/electorate-public.dto';
import type { ElectorateResponseDto } from '#/modules/elections/dto/electorate-response.dto';
import type { ElectorateDto } from '#/modules/elections/dto/electorate.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import { ElectorateEntity } from '#/modules/elections/entities/electorate.entity';

/**
 * Get registered voters, turnout and ballot counts by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of ElectorateEntity); review it and add business rules here.
 */
@Injectable()
export class GetElectorateByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(ElectorateEntity);
  }

  private toReadModel(entity: ElectorateEntity): ElectoratePublicDto {
    return {
    createdAt: entity.createdAt,
    declaredAt: entity.declaredAt,
    declaringInstitutionId: entity.declaringInstitutionId,
    electionId: entity.electionId,
    evidenceForm: entity.evidenceForm,
    geoUnitId: entity.geoUnitId,
    id: entity.id,
    isCurrent: entity.isCurrent,
    registerVersion: entity.registerVersion,
    registeredVoters: entity.registeredVoters,
    rejectedVotes: entity.rejectedVotes,
    resultLevelId: entity.resultLevelId,
    resultStatus: entity.resultStatus,
    seatId: entity.seatId,
    spoiltVotes: entity.spoiltVotes,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    validVotes: entity.validVotes,
    version: entity.version,
    votesCast: entity.votesCast,
    } as unknown as ElectoratePublicDto;
  }

  async execute(input: { electorateId: string }): Promise<ElectorateResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.electorateId } as never);
    if (!entity) throw new NotFoundException('Electorate not found');
    return {
      electorate: this.toReadModel(entity),
    } as unknown as ElectorateResponseDto;
  }
}