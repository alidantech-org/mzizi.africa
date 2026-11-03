import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { ElectionDto } from '#/modules/elections/dto/election.dto';
import type { SeatAllocationPublicDto } from '#/modules/elections/dto/seat-allocation-public.dto';
import type { SeatAllocationResponseDto } from '#/modules/elections/dto/seat-allocation-response.dto';
import type { SeatAllocationDto } from '#/modules/elections/dto/seat-allocation.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import { SeatAllocationEntity } from '#/modules/elections/entities/seat-allocation.entity';

/**
 * Get party-list and nominated seat allocations by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of SeatAllocationEntity); review it and add business rules here.
 */
@Injectable()
export class GetSeatAllocationByIdUseCase {
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

  async execute(input: { allocationId: string }): Promise<SeatAllocationResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.allocationId } as never);
    if (!entity) throw new NotFoundException('SeatAllocation not found');
    return {
      allocation: this.toReadModel(entity),
    } as unknown as SeatAllocationResponseDto;
  }
}