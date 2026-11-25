import { Controller, Get, HttpCode, Query } from "@nestjs/common";
import { MessageCollectionDto } from "#/modules/product/schema/dto/message-collection.dto.ts";
import { MessageWindowDto } from "#/modules/product/schema/dto/message-window.dto.ts";
import { ProductCopyService } from "./copy.service.ts";

@Controller()
export class ProductCopyController {
  constructor(private readonly service: ProductCopyService) {}

  @Get("/v1/product/messages")
  @HttpCode(200)
  listMessages(@Query() input: MessageWindowDto): Promise<MessageCollectionDto> {
    return this.service.listMessages(input);
  }
}
