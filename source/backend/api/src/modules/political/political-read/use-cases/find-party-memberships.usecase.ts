import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { PartyMembershipListQueryDto } from '#/modules/political/dto/party-membership-list-query.dto';
import type { PartyMembershipPublicDto } from '#/modules/political/dto/party-membership-public.dto';
import type { PartyMembershipDto } from '#/modules/political/dto/party-membership.dto';
import type { PartyMembershipsListResponseDto } from '#/modules/political/dto/party-memberships-list-response.dto';
import type { PartyDto } from '#/modules/political/dto/party.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { PartyMembershipEntity } from '#/modules/political/entities/party-membership.entity';
import { listPage } from '#/read/list-page';

/**
 * List party memberships.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of PartyMembershipEntity); review it and add business rules here.
 */
@Injectable()
export class FindPartyMembershipsUseCase {
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

  async execute(input: PartyMembershipListQueryDto): Promise<PartyMembershipsListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { memberships: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as PartyMembershipsListResponseDto;
  }
}
