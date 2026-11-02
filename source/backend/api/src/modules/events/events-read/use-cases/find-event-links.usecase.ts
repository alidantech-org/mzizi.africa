import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { EventLinkListQueryDto } from '#/modules/events/dto/event-link-list-query.dto';
import type { EventLinkPublicDto } from '#/modules/events/dto/event-link-public.dto';
import type { EventLinkDto } from '#/modules/events/dto/event-link.dto';
import type { EventLinksListResponseDto } from '#/modules/events/dto/event-links-list-response.dto';
import type { EventDto } from '#/modules/events/dto/event.dto';
import type { JurisdictionDto } from '#/modules/reference/dto/jurisdiction.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { EvidencedEntityDto } from '#/modules/shared/dto/evidenced-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { EventLinkEntity } from '#/modules/events/entities/event-link.entity';

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
    artifactChecksum: entity.artifactChecksum,
    artifactId: entity.artifactId,
    confidence: entity.confidence,
    createdAt: entity.createdAt,
    eventId: entity.eventId,
    id: entity.id,
    isCurrent: entity.isCurrent,
    licence: entity.licence,
    method: entity.method,
    retrievedAt: entity.retrievedAt,
    role: entity.role,
    sourceName: entity.sourceName,
    sourceReference: entity.sourceReference,
    sourceUrl: entity.sourceUrl,
    targetId: entity.targetId,
    targetKind: entity.targetKind,
    toolOrModel: entity.toolOrModel,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    verificationState: entity.verificationState,
    version: entity.version,
    } as unknown as EventLinkPublicDto;
  }

  async execute(input: EventLinkListQueryDto): Promise<EventLinksListResponseDto> {
    const page = Number(input.page ?? 1);
    const limit = Number(input.limit ?? 20);
    const where: Record<string, unknown> = {};
    if (input.eventId !== undefined) where.eventId = input.eventId;
    if (input.targetId !== undefined) where.targetId = input.targetId;
    if (input.targetKind !== undefined) where.targetKind = input.targetKind;
    const [rows, total] = await this.repository.findAndCount({
      where: where as FindOptionsWhere<EventLinkEntity>,
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      links: rows.map((entity) => this.toReadModel(entity)),
    meta: {
      limit: limit,
      page: page,
      total: total,
      totalPages: Math.ceil(total / limit),
    },
    } as unknown as EventLinksListResponseDto;
  }
}