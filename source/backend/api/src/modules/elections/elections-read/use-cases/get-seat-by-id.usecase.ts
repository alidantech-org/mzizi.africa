import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { ElectionDto } from '#/modules/elections/dto/election.dto';
import type { SeatPublicDto } from '#/modules/elections/dto/seat-public.dto';
import type { SeatResponseDto } from '#/modules/elections/dto/seat-response.dto';
import type { SeatDto } from '#/modules/elections/dto/seat.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import { SeatEntity } from '#/modules/elections/entities/seat.entity';

/**
 * Get seats by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of SeatEntity); review it and add business rules here.
 */
@Injectable()
export class GetSeatByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(SeatEntity);
  }

  private toReadModel(entity: SeatEntity): SeatPublicDto {
    return {
    code: entity.code,
    createdAt: entity.createdAt,
    electionId: entity.electionId,
    geoUnitId: entity.geoUnitId,
    id: entity.id,
    isCurrent: entity.isCurrent,
    legalBasisId: entity.legalBasisId,
    officeId: entity.officeId,
    positions: entity.positions,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    version: entity.version,
    } as unknown as SeatPublicDto;
  }

  async execute(input: { seatId: string }): Promise<SeatResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.seatId } as never);
    if (!entity) throw new NotFoundException('Seat not found');
    return {
      seat: this.toReadModel(entity),
    } as unknown as SeatResponseDto;
  }
}