import type { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const READ_CONNECTION = "read";
export const WRITE_CONNECTION = "write";

// The API never owns schema: synchronize and migrationsRun are fixed to false and no
// migration or seed path is configured. Migrations belong to source/backend/db-engine.
function options(name: string, url: string | undefined): TypeOrmModuleOptions {
  return {
    name,
    type: "postgres",
    url,
    autoLoadEntities: true,
    synchronize: false,
    migrationsRun: false,
    migrations: [],
    // Do not fail application start when the database is unreachable (health reports it).
    retryAttempts: 0,
    manualInitialization: !url,
  };
}

export const readOptions = (): TypeOrmModuleOptions =>
  options(READ_CONNECTION, process.env.DATABASE_READ_URL);
export const writeOptions = (): TypeOrmModuleOptions =>
  options(WRITE_CONNECTION, process.env.DATABASE_WRITE_URL);
