/// <reference types="vite/client" />
import "reflect-metadata";

import { type INestApplication, Module } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { exportSPKI, generateKeyPair, SignJWT, type CryptoKey } from "jose";
import { DataSource } from "typeorm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { AppModule } from "#/app.module";
import { createTokenVerifier, installAuth } from "#/auth";
import { DatabaseModule } from "#/database/database.module";
import { grantReadOnly, scratchDatabase, synchronizeDomainSchemas } from "#/database/scratch-database";
import { setWriteDataSource } from "#/database/write-database";
import { CommentEntity } from "#/modules/audit/entities/comment.entity";
import { EvidenceReferenceEntity } from "#/modules/audit/entities/evidence-reference.entity";
import { ReviewDecisionEntity } from "#/modules/audit/entities/review-decision.entity";

/**
 * Project-owned end-to-end test of the API's only writes, over HTTP, on a real PostgreSQL
 * (TEST_DATABASE_URL). Reads use a SELECT-only role and writes use an INSERT-only role on the three
 * audit tables, as in production; tokens are signed with a throwaway key.
 */
const adminUrl = process.env.TEST_DATABASE_URL;
const READER = "mzizi_audit_reader";
const WRITER = "mzizi_audit_writer";
const ISSUER = "https://issuer.example.test";
const CONTRIBUTOR = "11111111-aaaa-4aaa-8aaa-111111111111";
const REVIEWER = "22222222-bbbb-4bbb-8bbb-222222222222";
const entities = Object.values(
  import.meta.glob("../../*/entities/*.entity.ts", { eager: true }) as Record<string, Record<string, Function>>,
).flatMap((module) => Object.values(module));

describe.skipIf(!adminUrl)("audit write paths (HTTP, PostgreSQL)", () => {
  let admin: DataSource;
  let writer: DataSource;
  let app: INestApplication;
  let base: string;
  let privateKey: CryptoKey;
  let jurisdictionId: string;

  const sign = (subject: string, roles: string[]) =>
    new SignJWT({ roles }).setProtectedHeader({ alg: "RS256" }).setIssuer(ISSUER).setSubject(subject).setExpirationTime("5m").sign(privateKey);
  const post = async (path: string, body: unknown, bearer?: string) => {
    const response = await fetch(base + path, {
      method: "POST",
      headers: { "content-type": "application/json", ...(bearer ? { authorization: `Bearer ${bearer}` } : {}) },
      body: JSON.stringify(body),
    });
    return { status: response.status, body: (await response.json().catch(() => ({}))) as Record<string, any> };
  };
  const urlFor = (dbUrl: string, user: string) => {
    const url = new URL(dbUrl);
    url.username = user;
    url.password = "pw";
    return url.toString();
  };

  beforeAll(async () => {
    const pair = await generateKeyPair("RS256", { extractable: true });
    privateKey = pair.privateKey;
    const dbUrl = await scratchDatabase(adminUrl as string, "mzizi_test");
    admin = new DataSource({ type: "postgres", url: dbUrl, entities, synchronize: false });
    await admin.initialize();
    await synchronizeDomainSchemas(admin);
    const jurisdiction = await admin.getRepository(entities.find((e) => e.name === "JurisdictionEntity") as never).save({
      code: "ke", name: "Kenya", kind: "modern_state", isCurrent: true, version: 1, createdAt: new Date(), updatedAt: new Date(),
    } as never);
    jurisdictionId = (jurisdiction as unknown as { id: string }).id;

    for (const role of [READER, WRITER]) {
      await admin.query(`DO $$ BEGIN IF EXISTS (SELECT FROM pg_roles WHERE rolname = '${role}') THEN DROP OWNED BY ${role}; DROP ROLE ${role}; END IF; END $$`);
      await admin.query(`CREATE ROLE ${role} LOGIN PASSWORD 'pw'`);
    }
    await grantReadOnly(admin, READER);
    await admin.query(`GRANT USAGE ON SCHEMA audit TO ${WRITER}`);
    await admin.query(`GRANT SELECT, INSERT ON audit.comments, audit.evidence, audit.decisions TO ${WRITER}`);

    writer = new DataSource({ type: "postgres", url: urlFor(dbUrl, WRITER), entities: [CommentEntity, EvidenceReferenceEntity, ReviewDecisionEntity] });
    await writer.initialize();
    setWriteDataSource(writer);

    @Module({ imports: [TypeOrmModule.forRoot({ type: "postgres", url: urlFor(dbUrl, READER), autoLoadEntities: true, synchronize: false })] })
    class ReaderDatabaseModule {}

    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).overrideModule(DatabaseModule).useModule(ReaderDatabaseModule).compile();
    app = moduleRef.createNestApplication();
    installAuth(app, createTokenVerifier({ issuer: ISSUER, publicKeyPem: await exportSPKI(pair.publicKey) }));
    await app.listen(0);
    base = (await app.getUrl()).replace("[::1]", "localhost");
  });

  afterAll(async () => {
    await app?.close();
    setWriteDataSource(undefined);
    await writer?.destroy();
    for (const role of [READER, WRITER]) {
      await admin?.query(`DROP OWNED BY ${role}`);
      await admin?.query(`DROP ROLE IF EXISTS ${role}`);
    }
    await admin?.destroy();
  });

  const comment = (extra: Record<string, unknown> = {}) => ({ targetKind: "reference.jurisdictions", get targetId() { return jurisdictionId; }, body: "Needs a source for the founding date.", ...extra });

  describe("access", () => {
    it("refuses a request without a token", async () => {
      expect((await post("/v1/audit/comments", comment())).status).toBe(401);
    });

    it("refuses a reader", async () => {
      expect((await post("/v1/audit/comments", comment(), await sign(CONTRIBUTOR, ["reader"]))).status).toBe(403);
    });

    it("refuses a contributor a review decision but admits a reviewer", async () => {
      const decision = { targetKind: "reference.jurisdictions", targetId: jurisdictionId, decision: "approve", proposedState: "verified", rationale: "Matches the gazette." };
      expect((await post("/v1/audit/decisions", decision, await sign(CONTRIBUTOR, ["contributor"]))).status).toBe(403);
      const ok = await post("/v1/audit/decisions", decision, await sign(REVIEWER, ["reviewer"]));
      expect(ok.status).toBe(201);
      expect(ok.body.decision.reviewerId).toBe(REVIEWER);
    });
  });

  describe("comments", () => {
    it("records the actor from the token, ignoring any actor sent in the body", async () => {
      const response = await post("/v1/audit/comments", comment({ actorId: REVIEWER }), await sign(CONTRIBUTOR, ["contributor"]));
      expect(response.status).toBe(201);
      expect(response.body.comment).toMatchObject({ actorId: CONTRIBUTOR, targetKind: "reference.jurisdictions", version: 1 });
    });

    it("rejects an unknown target kind and a missing target", async () => {
      const bearer = await sign(CONTRIBUTOR, ["contributor"]);
      expect((await post("/v1/audit/comments", comment({ targetKind: "users; DROP TABLE audit.comments" }), bearer)).status).toBe(400);
      expect((await post("/v1/audit/comments", comment({ targetId: "99999999-9999-4999-8999-999999999999" }), bearer)).status).toBe(404);
    });

    it("only threads a reply under a comment on the same record", async () => {
      const bearer = await sign(CONTRIBUTOR, ["contributor"]);
      const parent = await post("/v1/audit/comments", comment(), bearer);
      const reply = await post("/v1/audit/comments", comment({ parentCommentId: parent.body.comment.id }), bearer);
      expect(reply.status).toBe(201);
      const stranger = await post("/v1/audit/comments", comment({ parentCommentId: "99999999-9999-4999-8999-999999999999" }), bearer);
      expect(stranger.status).toBe(400);
    });

    it("lists comments publicly, without a token", async () => {
      const response = await fetch(`${base}/v1/audit/comments?targetKind=reference.jurisdictions&targetId=${jurisdictionId}`);
      expect(response.status).toBe(200);
      const body = (await response.json()) as { comments: Array<{ actorId: string }> };
      expect(body.comments.length).toBeGreaterThanOrEqual(2);
      expect(body.comments.every((item) => item.actorId === CONTRIBUTOR)).toBe(true);
    });
  });

  describe("evidence", () => {
    const evidence = (extra: Record<string, unknown> = {}) => ({
      targetKind: "reference.jurisdictions", targetId: jurisdictionId, fileId: "33333333-cccc-4ccc-8ccc-333333333333", note: "Gazette notice", ...extra,
    });

    it("records a reference to a file in the filesystem schema without storing any bytes", async () => {
      const response = await post("/v1/audit/evidence", evidence(), await sign(CONTRIBUTOR, ["contributor"]));
      expect(response.status).toBe(201);
      expect(response.body.evidence).toMatchObject({ actorId: CONTRIBUTOR, fileId: "33333333-cccc-4ccc-8ccc-333333333333" });
    });

    it("rejects a file id that is not a uuid", async () => {
      const response = await post("/v1/audit/evidence", evidence({ fileId: "not-a-uuid" }), await sign(CONTRIBUTOR, ["contributor"]));
      expect(response.status).toBeGreaterThanOrEqual(400);
      expect(response.status).toBeLessThan(500);
    });
  });

  describe("database boundary", () => {
    it("lets the writer role insert audit records only", async () => {
      await expect(writer.query(`UPDATE audit.comments SET body = 'edited'`)).rejects.toThrow(/permission denied/);
      await expect(writer.query(`DELETE FROM audit.comments`)).rejects.toThrow(/permission denied/);
      await expect(writer.query(`UPDATE reference.jurisdictions SET name = 'x'`)).rejects.toThrow(/permission denied/);
      await expect(writer.query(`DELETE FROM legal.instruments`)).rejects.toThrow(/permission denied/);
    });

    it("never changes canonical data: the jurisdiction is untouched after all writes", async () => {
      const [row] = await admin.query(`SELECT name, is_current FROM reference.jurisdictions WHERE id = $1`, [jurisdictionId]);
      expect(row).toEqual({ name: "Kenya", is_current: true });
    });
  });
});
