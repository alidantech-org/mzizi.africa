import "reflect-metadata";

import { ForbiddenException, UnauthorizedException, type ExecutionContext } from "@nestjs/common";
import { exportSPKI, generateKeyPair, SignJWT, type CryptoKey } from "jose";
import { Pool } from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { PgAccessAuthority, type AccessAuthority } from "#/auth/authority";
import { DatabaseAuthGuard } from "#/auth/database-auth.guard";
import { createIdentityVerifier } from "#/auth/token-verifier";

const ISSUER = "https://sso.example.test/realms/mzizi";
let privateKey: CryptoKey;
let publicKeyPem: string;

const signed = (subject: string) => new SignJWT({}).setProtectedHeader({ alg: "RS256" }).setIssuer(ISSUER).setSubject(subject).setIssuedAt().setExpirationTime("5m").sign(privateKey);
const context = (method: string, path: string, authorization?: string, request: Record<string, unknown> = {}) =>
  ({ switchToHttp: () => ({ getRequest: () => Object.assign(request, { method, route: { path }, headers: { authorization } }) }) }) as unknown as ExecutionContext;

beforeAll(async () => {
  const pair = await generateKeyPair("RS256", { extractable: true });
  privateKey = pair.privateKey;
  publicKeyPem = await exportSPKI(pair.publicKey);
});

describe("identity verifier", () => {
  const verify = () => createIdentityVerifier({ issuer: ISSUER, publicKeyPem });
  it("accepts opaque non-UUID subjects", async () => {
    expect(await verify()(await signed("auth0|65f1c3"))).toEqual({ issuer: ISSUER, subject: "auth0|65f1c3" });
  });
  it("rejects a token with the wrong issuer", async () => {
    const bad = await new SignJWT({}).setProtectedHeader({ alg: "RS256" }).setIssuer("https://evil.example").setSubject("x").setExpirationTime("5m").sign(privateKey);
    await expect(verify()(bad)).rejects.toBeInstanceOf(UnauthorizedException);
  });
});

describe("database auth guard (fake authority)", () => {
  const authority = (outcome: "ok" | "unknown_identity" | "account_not_active", allowed: boolean, asked: string[] = []): AccessAuthority => ({
    resolve: async () => ({ accountId: outcome === "unknown_identity" ? null : "acct-1", outcome }),
    canPlatform: async (_account, permission) => (asked.push(permission), allowed),
    can: async () => ({ allowed, reason: "x" }),
    canChange: async () => ({ allowed, reason: "x" }),
  });
  const guard = (a: AccessAuthority) => new DatabaseAuthGuard(createIdentityVerifier({ issuer: ISSUER, publicKeyPem }), a);

  it("leaves public reads alone and requires a bearer token on protected routes", async () => {
    expect(await guard(authority("ok", true)).canActivate(context("GET", "/v1/legal/instruments"))).toBe(true);
    await expect(guard(authority("ok", true)).canActivate(context("POST", "/v1/audit/comments"))).rejects.toBeInstanceOf(UnauthorizedException);
  });
  it("401 for unknown identities, 403 for suspended accounts and missing permissions", async () => {
    const header = `Bearer ${await signed("someone")}`;
    await expect(guard(authority("unknown_identity", true)).canActivate(context("POST", "/v1/audit/comments", header))).rejects.toBeInstanceOf(UnauthorizedException);
    await expect(guard(authority("account_not_active", true)).canActivate(context("POST", "/v1/audit/comments", header))).rejects.toBeInstanceOf(ForbiddenException);
    await expect(guard(authority("ok", false)).canActivate(context("POST", "/v1/audit/comments", header))).rejects.toBeInstanceOf(ForbiddenException);
  });
  it("asks for the route's permission and sets the actor", async () => {
    const asked: string[] = [];
    const request: Record<string, unknown> = {};
    const header = `Bearer ${await signed("someone")}`;
    expect(await guard(authority("ok", true, asked)).canActivate(context("POST", "/v1/pipeline/candidates/:candidateId/promote", header, request))).toBe(true);
    expect(asked).toEqual(["pipeline.publish"]);
    expect(request.actor).toMatchObject({ actorId: "acct-1" });
  });
});

/** Runs against the disposable rewrite database when it has been initialised (`uv run mzizi-db init` at the repository root). */
const rewriteUrl = process.env.REWRITE_DATABASE_URL ?? "postgres://postgres@localhost:5432/mzizi_new";
describe("PgAccessAuthority against mzizi_new", () => {
  let pool: Pool;
  let available = false;
  beforeAll(async () => {
    pool = new Pool({ connectionString: rewriteUrl, max: 2 });
    try {
      available = (await pool.query(`SELECT to_regclass('auth.accounts') AS t`)).rows[0].t !== null;
    } catch {
      available = false;
    }
  });
  afterAll(async () => pool.end());

  it("resolves an identity and applies the same decisions as the SQL functions", async (ctx) => {
    if (!available) return ctx.skip();
    const client = await pool.connect();
    const subject = `spec|${Date.now()}`;
    try {
      await client.query("BEGIN");
      await client.query(`SELECT auth.bootstrap_admin($1, $2, 'Spec Admin')`, [ISSUER, subject]);
      const authority = new PgAccessAuthority(client as unknown as Pool);
      const resolved = await authority.resolve({ issuer: ISSUER, subject });
      expect(resolved.outcome).toBe("ok");
      expect(await authority.canPlatform(resolved.accountId!, "pipeline.publish")).toBe(true);
      const reader = (await client.query(`INSERT INTO auth.accounts (display_name) VALUES ('Reader') RETURNING id`)).rows[0].id;
      await client.query(`SELECT auth.grant_role($1, $2, 'reader')`, [resolved.accountId, reader]);
      expect(await authority.canPlatform(reader, "pipeline.publish")).toBe(false);
      expect((await authority.resolve({ issuer: ISSUER, subject: "someone-else" })).outcome).toBe("unknown_identity");
    } finally {
      await client.query("ROLLBACK");
      client.release();
    }
  });
});
