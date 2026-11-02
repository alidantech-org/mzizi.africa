import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { EventListQueryDto } from '#/modules/events/dto/event-list-query.dto';
import type { EventPublicDto } from '#/modules/events/dto/event-public.dto';
import type { EventDto } from '#/modules/events/dto/event.dto';
import type { EventsListResponseDto } from '#/modules/events/dto/events-list-response.dto';
import type { JurisdictionDto } from '#/modules/reference/dto/jurisdiction.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { EvidencedEntityDto } from '#/modules/shared/dto/evidenced-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { EventEntity } from '#/modules/events/entities/event.entity';
import { listPage } from '#/read/list-page';

/**
 * List events.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of EventEntity); review it and add business rules here.
 */
@Injectable()
export class FindEventsUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(EventEntity);
  }

  private toReadModel(entity: EventEntity): EventPublicDto {
    return {
    artifactChecksum: entity.artifactChecksum,
    artifactId: entity.artifactId,
    code: entity.code,
    confidence: entity.confidence,
    createdAt: entity.createdAt,
    description: entity.description,
    endsOn: entity.endsOn,
    geoUnitId: entity.geoUnitId,
    id: entity.id,
    impactLevel: entity.impactLevel,
    isCurrent: entity.isCurrent,
    isRecurring: entity.isRecurring,
    jurisdictionId: entity.jurisdictionId,
    licence: entity.licence,
    method: entity.method,
    retrievedAt: entity.retrievedAt,
    sourceName: entity.sourceName,
    sourceReference: entity.sourceReference,
    sourceUrl: entity.sourceUrl,
    startsOn: entity.startsOn,
    status: entity.status,
    title: entity.title,
    toolOrModel: entity.toolOrModel,
    typeId: entity.typeId,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    verificationState: entity.verificationState,
    version: entity.version,
    } as unknown as EventPublicDto;
  }

  async execute(input: EventListQueryDto): Promise<EventsListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { events: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as EventsListResponseDto;
  }
}
