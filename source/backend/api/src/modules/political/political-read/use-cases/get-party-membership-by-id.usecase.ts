import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { PartyMembershipPublicDto } from '#/modules/political/dto/party-membership-public.dto';
import type { PartyMembershipResponseDto } from '#/modules/political/dto/party-membership-response.dto';
import type { PartyMembershipDto } from '#/modules/political/dto/party-membership.dto';
import type { PartyDto } from '#/modules/political/dto/party.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import { PartyMembershipEntity } from '#/modules/political/entities/party-membership.entity';

/**
 * Get party memberships by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of PartyMembershipEntity); review it and add business rules here.
 */
@Injectable()
export class GetPartyMembershipByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(PartyMembershipEntity);
  }

  private toReadModel(entity: PartyMembershipEntity): PartyMembershipPublicDto {
    return {
    createdAt: entity.createdAt,
    id: entity.id,
    isCurrent: entity.isCurrent,
    partyId: entity.partyId,
    personId: entity.personId,
    roleTitle: entity.roleTitle,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    version: entity.version,
    } as unknown as PartyMembershipPublicDto;
  }

  async execute(input: { membershipId: string }): Promise<PartyMembershipResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.membershipId } as never);
    if (!entity) throw new NotFoundException('PartyMembership not found');
    return {
      membership: this.toReadModel(entity),
    } as unknown as PartyMembershipResponseDto;
  }
}