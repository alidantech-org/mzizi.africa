/** Serves the system report and health probe; reads the database and the engine, owns no data. */
import { Module } from "@nestjs/common";
import { DiscoveryModule } from "@nestjs/core";

import { EngineModule } from "../engine/engine.module.ts";
import { SystemController } from "./system.controller.ts";
import { SystemService } from "./system.service.ts";

@Module({ imports: [DiscoveryModule, EngineModule], controllers: [SystemController], providers: [SystemService] })
export class SystemModule {}
