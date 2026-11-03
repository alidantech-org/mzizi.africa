import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { ElectionDto } from '#/modules/elections/dto/election.dto';
import type { SeatAllocationListQueryDto } from '#/modules/elections/dto/seat-allocation-list-query.dto';
import type { SeatAllocationPublicDto } from '#/modules/elections/dto/seat-allocation-public.dto';
import type { SeatAllocationDto } from '#/modules/elections/dto/seat-allocation.dto';
import type { SeatAllocationsListResponseDto } from '#/modules/elections/dto/seat-allocations-list-response.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { SeatAllocationEntity } from '#/modules/elections/entities/seat-allocation.entity';
import { listPage } from '#/read/list-page';

/**
 * List party-list and nominated seat allocations.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of SeatAllocationEntity); review it and add business rules here.
 */
@Injectable()
export class FindSeatAllocationsUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(SeatAllocationEntity);
  }

  private toReadModel(entity: SeatAllocationEntity): SeatAllocationPublicDto {
    return {
    allocatedOn: entity.allocatedOn,
    createdAt: entity.createdAt,
    declaringInstitutionId: entity.declaringInstitutionId,
    electionId: entity.electionId,
    geoUnitId: entity.geoUnitId,
    id: entity.id,
    isCurrent: entity.isCurrent,
    kind: entity.kind,
    listPosition: entity.listPosition,
    partyId: entity.partyId,
    personId: entity.personId,
    seatId: entity.seatId,
    seatsEntitled: entity.seatsEntitled,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    version: entity.version,
    } as unknown as SeatAllocationPublicDto;
  }

  async execute(input: SeatAllocationListQueryDto): Promise<SeatAllocationsListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { allocations: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as SeatAllocationsListResponseDto;
  }
}
