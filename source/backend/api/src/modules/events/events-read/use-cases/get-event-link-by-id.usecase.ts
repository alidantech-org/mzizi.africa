import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { EventLinkPublicDto } from '#/modules/events/dto/event-link-public.dto';
import type { EventLinkResponseDto } from '#/modules/events/dto/event-link-response.dto';
import type { EventLinkDto } from '#/modules/events/dto/event-link.dto';
import type { EventDto } from '#/modules/events/dto/event.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import { EventLinkEntity } from '#/modules/events/entities/event-link.entity';

/**
 * Get event links by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of EventLinkEntity); review it and add business rules here.
 */
@Injectable()
export class GetEventLinkByIdUseCase {
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

  async execute(input: { linkId: string }): Promise<EventLinkResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.linkId } as never);
    if (!entity) throw new NotFoundException('EventLink not found');
    return {
      link: this.toReadModel(entity),
    } as unknown as EventLinkResponseDto;
  }
}