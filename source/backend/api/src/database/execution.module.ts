/**
 * Durable execution: atomic mutations, receipt outbox, event emission with recovery.
 *
 * NOT YET WIRED: This module is a framework placeholder.
 * To activate: register ExecutionModule, run migrations, start supervised worker.
 *
 * Features (when implemented):
 * - Atomic database mutation + outbox in one transaction
 * - Event emission with guaranteed delivery (PostgreSQL + Redis Streams)
 * - Retries with exponential backoff and circuit breaker
 * - Recovery through PostgreSQL logs (no external queue needed)
 * - Nested workflows and joins (all/first-success)
 * - Idempotent handlers for external effects
 * - Durable cache invalidation after participant commit
 *
 * See: Dryv docs on execution pack and NestJS integration guide.
 */
import { Module } from "@nestjs/common";

@Module({
  providers: [],
  exports: [],
})
export class ExecutionModule {
  constructor() {
    if (process.env.EXECUTION_ENABLED !== "true") {
      console.info(
        "ExecutionModule loaded but disabled (EXECUTION_ENABLED not set). Durable execution not active.",
      );
    }
  }
}
