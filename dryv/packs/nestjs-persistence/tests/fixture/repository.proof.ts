import 'reflect-metadata';
import { afterAll, beforeAll, expect, test } from 'bun:test';
import { DataSource } from 'typeorm';
import { ListUseCase } from '#root/out/repository/reference/features/catalog/list.repository';
import { PersistencePolicyResolver, PersistenceRuntime } from '#runtime/persistence.runtime';
import { TypeOrmConnection } from '#runtime/typeorm-connection';
import type { TrustedContext } from '#runtime/persistence.types';
const url=process.env.DRYV_MIGRATION_TEST_URL;
const source=new DataSource({type:'postgres',url});
class Policies extends PersistencePolicyResolver { async resolve(): Promise<TrustedContext> { return {principal:null,policies:new Map()}; } }
beforeAll(async () => { if (!url) return; await source.initialize(); await source.query('CREATE SCHEMA repository_proof'); await source.query("CREATE TABLE repository_proof.schemes(code text PRIMARY KEY); INSERT INTO repository_proof.schemes VALUES ('KE'),('TZ')"); });
afterAll(async () => { if (!source.isInitialized) return; try { await source.query('DROP SCHEMA repository_proof CASCADE'); } finally { await source.destroy(); } });
(url ? test : test.skip)('generated use case executes typed canonical plan and validates DTOs',async () => {
 const usecase=new ListUseCase(new PersistenceRuntime(new TypeOrmConnection(source)),new Policies());
 const rows=await usecase.execute({prefix:'K'});
 expect(rows).toHaveLength(1); expect(rows[0]?.schemeCode).toBe('KE');
});
