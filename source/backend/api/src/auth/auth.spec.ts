import "reflect-metadata";

import { ForbiddenException, ServiceUnavailableException, UnauthorizedException, type ExecutionContext } from "@nestjs/common";
import { exportSPKI, generateKeyPair, SignJWT, type CryptoKey } from "jose";
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
