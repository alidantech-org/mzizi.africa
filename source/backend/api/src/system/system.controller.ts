/** Public service description (`/`) and liveness probe (`/health`). */
import { Controller, Get, HttpCode } from "@nestjs/common";

import { SystemService, type SystemReport } from "./system.service.ts";

@Controller()
export class SystemController {
  constructor(private readonly system: SystemService) {}

  @Get("/")
  @HttpCode(200)
  overview(): Promise<SystemReport> {
    return this.system.report();
  }

  @Get("/health")
  @HttpCode(200)
  async health(): Promise<{ status: "ok" | "degraded"; database: string }> {
    const database = await this.system.probeDatabase();
    return { status: database.status === "ok" ? "ok" : "degraded", database: database.status };
  }
}
