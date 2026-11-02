import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { PartyIdeologiesListResponseDto } from '#/modules/political/dto/party-ideologies-list-response.dto';
import type { PartyIdeologyListQueryDto } from '#/modules/political/dto/party-ideology-list-query.dto';
import type { PartyIdeologyPublicDto } from '#/modules/political/dto/party-ideology-public.dto';
import type { PartyIdeologyDto } from '#/modules/political/dto/party-ideology.dto';
import type { PartyDto } from '#/modules/political/dto/party.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { PartyIdeologyEntity } from '#/modules/political/entities/party-ideology.entity';
import { listPage } from '#/read/list-page';

/**
 * List party ideologies.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of PartyIdeologyEntity); review it and add business rules here.
 */
@Injectable()
export class FindPartyIdeologiesUseCase {
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

  async execute(input: PartyIdeologyListQueryDto): Promise<PartyIdeologiesListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { partyIdeologies: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as PartyIdeologiesListResponseDto;
  }
}
