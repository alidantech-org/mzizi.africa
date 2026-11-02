import { Injectable } from '@nestjs/common';
import type { EventLinkListQueryDto } from '#/modules/events/dto/event-link-list-query.dto';
import type { EventLinkResponseDto } from '#/modules/events/dto/event-link-response.dto';
import type { EventLinksListResponseDto } from '#/modules/events/dto/event-links-list-response.dto';
import type { EventListQueryDto } from '#/modules/events/dto/event-list-query.dto';
import type { EventResponseDto } from '#/modules/events/dto/event-response.dto';
import type { EventsListResponseDto } from '#/modules/events/dto/events-list-response.dto';
import { FindEventLinksUseCase } from '#/modules/events/events-read/use-cases/find-event-links.usecase';
import { FindEventsUseCase } from '#/modules/events/events-read/use-cases/find-events.usecase';
import { GetEventByIdUseCase } from '#/modules/events/events-read/use-cases/get-event-by-id.usecase';
import { GetEventLinkByIdUseCase } from '#/modules/events/events-read/use-cases/get-event-link-by-id.usecase';

/**
 * Events Read: implements the generated EventsEventsReadService contract by
 * delegating to one use case per operation. The feature module binds it to that contract.
 *
 * Scaffolded by Dryv once; this file belongs to the project. New operations need a method here.
 */
@Injectable()
export class EventsEventsReadServiceImpl {
  constructor(
    private readonly findEventLinksUseCase: FindEventLinksUseCase,
    private readonly findEventsUseCase: FindEventsUseCase,
    private readonly getEventByIdUseCase: GetEventByIdUseCase,
    private readonly getEventLinkByIdUseCase: GetEventLinkByIdUseCase,
  ) {}

  /** List event links. */
  findEventLinks(input: EventLinkListQueryDto) {
    return this.findEventLinksUseCase.execute(input);
  }

  /** List events. */
  findEvents(input: EventListQueryDto) {
    return this.findEventsUseCase.execute(input);
  }

  /** Get events by id. */
  getEventById(input: { eventId: string }) {
    return this.getEventByIdUseCase.execute(input);
  }

  /** Get event links by id. */
  getEventLinkById(input: { linkId: string }) {
    return this.getEventLinkByIdUseCase.execute(input);
  }
}