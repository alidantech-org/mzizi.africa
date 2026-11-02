import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { EventLinkListQueryDto } from '#/modules/events/dto/event-link-list-query.dto';
import type { EventLinkPublicDto } from '#/modules/events/dto/event-link-public.dto';
import type { EventLinkDto } from '#/modules/events/dto/event-link.dto';
import type { EventLinksListResponseDto } from '#/modules/events/dto/event-links-list-response.dto';
import type { EventDto } from '#/modules/events/dto/event.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { EventLinkEntity } from '#/modules/events/entities/event-link.entity';
import { listPage } from '#/read/list-page';

/**
 * List event links.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of EventLinkEntity); review it and add business rules here.
 */
@Injectable()
export class FindEventLinksUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(EventLinkEntity);
  }

  private toReadModel(entity: EventLinkEntity): EventLinkPublicDto {
    return {
    createdAt: entity.createdAt,
    eventId: entity.eventId,
    id: entity.id,
    isCurrent: entity.isCurrent,
    role: entity.role,
    targetId: entity.targetId,
    targetKind: entity.targetKind,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    version: entity.version,
    } as unknown as EventLinkPublicDto;
  }

  async execute(input: EventLinkListQueryDto): Promise<EventLinksListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { links: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as EventLinksListResponseDto;
  }
}
