import type { DataSource, EntityManager, QueryResult } from "typeorm";
import type {
  QueryConnection,
  TransactionConnection,
} from "./persistence.types";
/** Structured results avoid TypeORM's different SELECT/UPDATE/DELETE raw tuples. */
function managerConnection(manager: EntityManager): QueryConnection {
  return {
    async query(sql, parameters = []) {
      if (!manager.queryRunner)
        throw new Error("Expected a transaction-owned query runner");
      const result: QueryResult = await manager.queryRunner.query(
        sql,
        parameters,
        true,
      );
      const records: unknown = result.records;
      return records;
    },
  };
}
export class TypeOrmConnection implements TransactionConnection {
  constructor(private readonly source: DataSource) {}
  async query(sql: string, parameters: unknown[] = []): Promise<unknown> {
    const runner = this.source.createQueryRunner();
    try {
      const result: QueryResult = await runner.query(sql, parameters, true);
      const records: unknown = result.records;
      return records;
    } finally {
      await runner.release();
    }
  }
  transaction<T>(work: (manager: QueryConnection) => Promise<T>): Promise<T> {
    return this.source.transaction((manager) =>
      work(managerConnection(manager)),
    );
  }
}
