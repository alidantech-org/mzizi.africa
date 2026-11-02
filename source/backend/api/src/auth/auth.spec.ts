import "reflect-metadata";

import { ForbiddenException, ServiceUnavailableException, UnauthorizedException, type ExecutionContext } from "@nestjs/common";
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import { exportJWK, exportSPKI, generateKeyPair, SignJWT, type CryptoKey } from "jose";
import { beforeAll, describe, expect, it } from "vitest";

import { AuthGuard } from "#/auth/auth.guard";
import { highestRole, satisfies } from "#/auth/roles";
import { createTokenVerifier } from "#/auth/token-verifier";

const SUBJECT = "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11";
const ISSUER = "https://issuer.example.test";

let privateKey: CryptoKey;
let publicKeyPem: string;
let otherKey: CryptoKey;

async function token(claims: Record<string, unknown> = {}, options: { issuer?: string; expires?: string; key?: CryptoKey; subject?: string } = {}) {
  return new SignJWT(claims)
    .setProtectedHeader({ alg: "RS256" })
    .setIssuer(options.issuer ?? ISSUER)
    .setSubject(options.subject ?? SUBJECT)
    .setExpirationTime(options.expires ?? "5m")
    .sign(options.key ?? privateKey);
}

beforeAll(async () => {
  const pair = await generateKeyPair("RS256", { extractable: true });
  privateKey = pair.privateKey;
  publicKeyPem = await exportSPKI(pair.publicKey);
  otherKey = (await generateKeyPair("RS256")).privateKey;
});

describe("permissions", () => {
  it("lets a reviewer read the pipeline, approve and promote, but not manage access", () => {
    expect(satisfies("reviewer", "PipelineReadAccess")).toBe(true);
    expect(satisfies("reviewer", "CandidatePromoteAccess")).toBe(true);
    expect(satisfies("reviewer", "AssessmentApproveAccess")).toBe(true);
    expect(satisfies("reviewer", "AccessManageAccess")).toBe(false);
  });
  it("lets an admin do everything and a direct grant widen a reviewer", () => {
    expect(satisfies("admin", "CandidatePromoteAccess")).toBe(true);
    expect(satisfies("contributor", "CandidatePromoteAccess", ["candidate.promote"])).toBe(true);
    expect(satisfies("reader", "CandidatePromoteAccess", ["not.a.permission"])).toBe(false);
  });
});

describe("roles", () => {
  it("pick the highest known role and ignore the rest", () => {
    expect(highestRole(["reader", "reviewer", "wizard"])).toBe("reviewer");
    expect(highestRole("admin")).toBe("admin");
    expect(highestRole(undefined)).toBe("reader");
  });

  it("order policies by rank", () => {
    expect(satisfies("reviewer", "ContributorAccess")).toBe(true);
    expect(satisfies("contributor", "ReviewerAccess")).toBe(false);
    expect(satisfies("admin", "AdminAccess")).toBe(true);
    expect(satisfies("reader", "ContributorAccess")).toBe(false);
  });
});

describe("token verifier", () => {
  const verify = () => createTokenVerifier({ issuer: ISSUER, publicKeyPem });

  it("accepts a valid token and reads actor and role from claims", async () => {
    expect(await verify()(await token({ roles: ["contributor"] }))).toEqual({ actorId: SUBJECT, role: "contributor" });
  });

  it("treats a token without roles as a reader", async () => {
    expect((await verify()(await token())).role).toBe("reader");
  });

  it.each([
    ["wrong issuer", () => token({}, { issuer: "https://evil.example" })],
    ["expired", () => token({}, { expires: "-1m" })],
    ["signed with another key", () => token({}, { key: otherKey })],
    ["subject that is not a uuid", () => token({}, { subject: "alice" })],
  ])("rejects a token with %s", async (_name, make) => {
    await expect(verify()(await make())).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it("fails closed when authentication is not configured", async () => {
    await expect(createTokenVerifier({})("x")).rejects.toBeInstanceOf(ServiceUnavailableException);
  });
});

describe("token verifier with an issuer's JWKS endpoint (single sign-on)", () => {
  it("verifies a token signed by a key published at the JWKS URL, and rejects one signed by another key", async () => {
    const pair = await generateKeyPair("RS256", { extractable: true });
    const published = { ...(await exportJWK(pair.publicKey)), kid: "k1", alg: "RS256", use: "sig" };
    const server = createServer((_request, response) => {
      response.setHeader("content-type", "application/json");
      response.end(JSON.stringify({ keys: [published] }));
    });
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
    try {
      const verify = createTokenVerifier({ issuer: ISSUER, jwksUrl: `http://127.0.0.1:${(server.address() as AddressInfo).port}/jwks.json` });
      const signed = await new SignJWT({ roles: ["reviewer"] }).setProtectedHeader({ alg: "RS256", kid: "k1" }).setIssuer(ISSUER).setSubject(SUBJECT).setExpirationTime("5m").sign(pair.privateKey);
      expect(await verify(signed)).toEqual({ actorId: SUBJECT, role: "reviewer" });
      const forged = await new SignJWT({ roles: ["admin"] }).setProtectedHeader({ alg: "RS256", kid: "k1" }).setIssuer(ISSUER).setSubject(SUBJECT).setExpirationTime("5m").sign(privateKey);
      await expect(verify(forged)).rejects.toBeInstanceOf(UnauthorizedException);
    } finally {
      server.close();
    }
  });
});

describe("auth guard", () => {
  const verifier = () => createTokenVerifier({ issuer: ISSUER, publicKeyPem });
  const context = (method: string, path: string, authorization?: string) =>
    ({
      switchToHttp: () => ({ getRequest: () => ({ method, route: { path }, headers: { authorization } }) }),
    }) as unknown as ExecutionContext;

  it("lets public reads through without a token", async () => {
    expect(await new AuthGuard(verifier()).canActivate(context("GET", "/v1/legal/instruments"))).toBe(true);
  });

  it("requires a bearer token on protected routes", async () => {
    await expect(new AuthGuard(verifier()).canActivate(context("POST", "/v1/audit/comments"))).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it("refuses a role below the policy", async () => {
    const reader = await token({ roles: ["reader"] });
    await expect(new AuthGuard(verifier()).canActivate(context("POST", "/v1/audit/comments", `Bearer ${reader}`))).rejects.toBeInstanceOf(ForbiddenException);
    const contributor = await token({ roles: ["contributor"] });
    await expect(new AuthGuard(verifier()).canActivate(context("POST", "/v1/audit/decisions", `Bearer ${contributor}`))).rejects.toBeInstanceOf(ForbiddenException);
  });

  it("admits a sufficient role and places the actor on the request", async () => {
    const reviewer = await token({ roles: ["reviewer"] });
    const request = { method: "POST", route: { path: "/v1/audit/decisions" }, headers: { authorization: `Bearer ${reviewer}` } } as { actor?: unknown };
    const executionContext = { switchToHttp: () => ({ getRequest: () => request }) } as unknown as ExecutionContext;
    expect(await new AuthGuard(verifier()).canActivate(executionContext)).toBe(true);
    expect(request.actor).toEqual({ actorId: SUBJECT, role: "reviewer" });
  });
});
