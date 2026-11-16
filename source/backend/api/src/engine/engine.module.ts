/** Exposes the internal engine transport to NestJS consumers. */
import { Module } from "@nestjs/common";

import { EngineClient } from "./engine.client.ts";

@Module({ providers: [EngineClient], exports: [EngineClient] })
export class EngineModule {}
