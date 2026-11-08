import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { ElectionDto } from '#/modules/elections/dto/election.dto';
import type { ElectorateListQueryDto } from '#/modules/elections/dto/electorate-list-query.dto';
import type { ElectoratePublicDto } from '#/modules/elections/dto/electorate-public.dto';
import type { ElectorateDto } from '#/modules/elections/dto/electorate.dto';
import type { ElectoratesListResponseDto } from '#/modules/elections/dto/electorates-list-response.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { ElectorateEntity } from '#/modules/elections/entities/electorate.entity';
import { listPage } from '#/read/list-page';

/**
 * List registered voters, turnout and ballot counts.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of ElectorateEntity); review it and add business rules here.
 */
@Injectable()
export class FindElectoratesUseCase {
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

  async execute(input: ElectorateListQueryDto): Promise<ElectoratesListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { electorates: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as ElectoratesListResponseDto;
  }
}
