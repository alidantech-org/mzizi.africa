import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { PartyIdeologyPublicDto } from '#/modules/political/dto/party-ideology-public.dto';
import type { PartyIdeologyResponseDto } from '#/modules/political/dto/party-ideology-response.dto';
import type { PartyIdeologyDto } from '#/modules/political/dto/party-ideology.dto';
import type { PartyDto } from '#/modules/political/dto/party.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import { PartyIdeologyEntity } from '#/modules/political/entities/party-ideology.entity';

/**
 * Get party ideologies by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of PartyIdeologyEntity); review it and add business rules here.
 */
@Injectable()
export class GetPartyIdeologyByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(PartyIdeologyEntity);
  }

  private toReadModel(entity: PartyIdeologyEntity): PartyIdeologyPublicDto {
    return {
    createdAt: entity.createdAt,
    id: entity.id,
    ideologyId: entity.ideologyId,
    isCurrent: entity.isCurrent,
    partyId: entity.partyId,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    version: entity.version,
    } as unknown as PartyIdeologyPublicDto;
  }

  async execute(input: { partyIdeologyId: string }): Promise<PartyIdeologyResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.partyIdeologyId } as never);
    if (!entity) throw new NotFoundException('PartyIdeology not found');
    return {
      partyIdeology: this.toReadModel(entity),
    } as unknown as PartyIdeologyResponseDto;
  }
}