import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  Param,
  ParseBoolPipe,
  ParseFloatPipe,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from "@nestjs/common";

import { Cookie } from "#/modules/common/server/http/cookie.decorator.ts";
import { EventLinkListQueryDto } from "#/modules/events/dto/event-link-list-query.dto.ts";
import { EventLinkResponseDto } from "#/modules/events/dto/event-link-response.dto.ts";
import { EventLinksListResponseDto } from "#/modules/events/dto/event-links-list-response.dto.ts";
import { EventListQueryDto } from "#/modules/events/dto/event-list-query.dto.ts";
import { EventResponseDto } from "#/modules/events/dto/event-response.dto.ts";
import { EventsListResponseDto } from "#/modules/events/dto/events-list-response.dto.ts";
import { EventsEventsReadService } from "./events-read.service.ts";

@Controller()
export class EventsEventsReadController {
  constructor(private readonly service: EventsEventsReadService) {}


  @Get("/v1/events/links")
  @HttpCode(200)
  findEventLinks(
    @Query() input: EventLinkListQueryDto,
  ): Promise<EventLinksListResponseDto> {
    return this.service.findEventLinks(input);
  }


  @Get("/v1/events/events")
  @HttpCode(200)
  findEvents(
    @Query() input: EventListQueryDto,
  ): Promise<EventsListResponseDto> {
    return this.service.findEvents(input);
  }


  @Get("/v1/events/events/:eventId")
  @HttpCode(200)
  getEventById(
    @Param("eventId") eventId: string,
  ): Promise<EventResponseDto> {
    return this.service.getEventById({ eventId });
  }


  @Get("/v1/events/links/:linkId")
  @HttpCode(200)
  getEventLinkById(
    @Param("linkId") linkId: string,
  ): Promise<EventLinkResponseDto> {
    return this.service.getEventLinkById({ linkId });
  }
}