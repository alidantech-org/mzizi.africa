import { Module } from "@nestjs/common";
import { WebsiteWebsiteReadModule } from "#/modules/website/website-read/website-read.module.ts";

@Module({
  imports: [
    WebsiteWebsiteReadModule,
  ],
})
export class WebsiteModule {}