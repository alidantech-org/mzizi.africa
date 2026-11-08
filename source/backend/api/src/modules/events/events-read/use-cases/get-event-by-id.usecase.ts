import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { EventPublicDto } from '#/modules/events/dto/event-public.dto';
import type { EventResponseDto } from '#/modules/events/dto/event-response.dto';
import type { EventDto } from '#/modules/events/dto/event.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import { EventEntity } from '#/modules/events/entities/event.entity';

/**
 * Get events by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of EventEntity); review it and add business rules here.
 */
@Injectable()
export class GetEventByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(EventEntity);
  }

  private toReadModel(entity: EventEntity): EventPublicDto {
    return {
    code: entity.code,
    createdAt: entity.createdAt,
    description: entity.description,
    endsOn: entity.endsOn,
    geoUnitId: entity.geoUnitId,
    id: entity.id,
    impactLevel: entity.impactLevel,
    isCurrent: entity.isCurrent,
    isRecurring: entity.isRecurring,
    jurisdictionId: entity.jurisdictionId,
    startsOn: entity.startsOn,
    status: entity.status,
    title: entity.title,
    typeId: entity.typeId,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    version: entity.version,
    } as unknown as EventPublicDto;
  }

  async execute(input: { eventId: string }): Promise<EventResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.eventId } as never);
    if (!entity) throw new NotFoundException('Event not found');
    return {
      event: this.toReadModel(entity),
    } as unknown as EventResponseDto;
  }
}