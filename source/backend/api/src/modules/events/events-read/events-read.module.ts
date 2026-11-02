import { Module, type Type } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EventLinkEntity } from "#/modules/events/entities/event-link.entity.ts";
import { EventEntity } from "#/modules/events/entities/event.entity.ts";
import { JurisdictionEntity } from "#/modules/reference/entities/jurisdiction.entity.ts";
import { EventsEventsReadServiceImpl } from "#/modules/events/events-read/events-read.service.impl.ts";
import { FindEventLinksUseCase } from "#/modules/events/events-read/use-cases/find-event-links.usecase.ts";
import { FindEventsUseCase } from "#/modules/events/events-read/use-cases/find-events.usecase.ts";
import { GetEventByIdUseCase } from "#/modules/events/events-read/use-cases/get-event-by-id.usecase.ts";
import { GetEventLinkByIdUseCase } from "#/modules/events/events-read/use-cases/get-event-link-by-id.usecase.ts";

import { EventsEventsReadController } from "./events-read.controller.ts";
import { EventsEventsReadService } from "./events-read.service.ts";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EventLinkEntity,
      EventEntity,
      JurisdictionEntity,
    ]),
  ],
  controllers: [EventsEventsReadController],
  providers: [
    {
      provide: EventsEventsReadService,
      useClass: EventsEventsReadServiceImpl satisfies Type<EventsEventsReadService>,
    },
    FindEventLinksUseCase,
    FindEventsUseCase,
    GetEventByIdUseCase,
    GetEventLinkByIdUseCase,
  ],
  exports: [EventsEventsReadService],
})
export class EventsEventsReadModule {}