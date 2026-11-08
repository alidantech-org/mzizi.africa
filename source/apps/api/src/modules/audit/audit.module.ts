import { Module } from "@nestjs/common";
import { AuditAuditModule } from "#/modules/audit/audit/audit.module.ts";

@Module({
  imports: [
    AuditAuditModule,
  ],
})
export class AuditModule {}