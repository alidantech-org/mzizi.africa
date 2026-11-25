/**
 * The application's persistence wiring (project-owned). Generated use cases execute their typed plans through one
 * `PersistenceRuntime`: a TypeORM DataSource for the `main` store (`DATABASE_URL`) and, when `REDIS_URL` is set, scoped
 * Redis caching (keys include store, operation, inputs and principal; writes bump the operation generation after commit).
 * No migrations or schema synchronization run here: the database CLI owns the schema.
 */
import { Global, Injectable, Module, type OnApplicationShutdown } from "@nestjs/common";
import { RedisClient } from "bun";
import { DataSource } from "typeorm";
import { PersistencePolicyResolver, PersistenceRuntime, StoreConnections } from "#/database/persistence/persistence.runtime";
import type { TrustedContext } from "#/database/persistence/persistence.types";
import { RedisCache, type RedisCommands } from "#/database/persistence/redis-cache";
import { TypeOrmConnection } from "#/database/persistence/typeorm-connection";

/** The canonical store name the contracts declare (`dryv.yaml` stores.main). */
const MAIN_STORE = "main";

/** Prefix of every cache key: "mzizi:api:{environment}:{store}".
 * Environment from NODE_ENV (dev/staging/prod); store from dryv.yaml stores.main.
 * When you need to invalidate all keys in an environment (e.g., breaking API changes),
 * update this prefix and redeploy. Keys are scoped by operation, so old entries expire naturally. */
function cachePrefix(): string {
  const env = process.env.NODE_ENV || "dev";
  const store = MAIN_STORE;
  return `mzizi:api:${env}:${store}`;
}

/** No sign-in is wired yet: requests carry no principal, so operations that require a policy fail closed. */
@Injectable()
export class AnonymousPolicyResolver extends PersistencePolicyResolver {
  async resolve(_operation: string): Promise<TrustedContext> {
    return { principal: null, policies: new Map() };
  }
}

function redisCommands(client: RedisClient): RedisCommands {
  return {
    command: ([name, ...args]) => {
      if (name === undefined) throw new Error("empty Redis command");
      return client.send(name, args);
    },
  };
}

@Global()
@Module({
  providers: [
    {
      provide: DataSource,
      useFactory: async (): Promise<DataSource> => {
        const url = process.env.DATABASE_URL;
        if (!url) throw new Error("DATABASE_URL is required");
        return new DataSource({ type: "postgres", url, synchronize: false, entities: [] }).initialize();
      },
    },
    {
      provide: PersistenceRuntime,
      inject: [DataSource],
      useFactory: (source: DataSource): PersistenceRuntime => {
        const stores = new StoreConnections(new Map([[MAIN_STORE, new TypeOrmConnection(source)]]));
        const redisUrl = process.env.REDIS_URL;
        const cache = redisUrl ? new RedisCache(redisCommands(new RedisClient(redisUrl)), cachePrefix()) : undefined;
        return new PersistenceRuntime(stores, cache);
      },
    },
    { provide: PersistencePolicyResolver, useClass: AnonymousPolicyResolver },
  ],
  exports: [DataSource, PersistenceRuntime, PersistencePolicyResolver],
})
export class DatabaseModule implements OnApplicationShutdown {
  constructor(private readonly source: DataSource) {}
  async onApplicationShutdown(): Promise<void> {
    if (this.source.isInitialized) await this.source.destroy();
  }
}
