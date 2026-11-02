import { ServiceUnavailableException, UnauthorizedException } from "@nestjs/common";
import { createRemoteJWKSet, importSPKI, jwtVerify, type JWTVerifyGetKey, type CryptoKey, type KeyObject } from "jose";

import type { Actor } from "#/auth/actor-context";
import { highestRole } from "#/auth/roles";

/**
 * Verifies bearer tokens from an OIDC-compatible issuer (DEC-API-AUTH-RBAC). Mzizi issues no
 * credentials and stores no passwords. Configuration:
 *
 *   AUTH_ISSUER       expected `iss` (required)
 *   AUTH_AUDIENCE     expected `aud` (optional)
 *   AUTH_JWKS_URL     the issuer's JWKS endpoint, or
 *   AUTH_PUBLIC_KEY   a PEM public key (SPKI), for local development and tests
 *
 * The actor id is the `sub` claim (a uuid); the role is the highest of the `roles` claim.
 */
export interface VerifierConfig {
  issuer?: string;
  audience?: string;
  jwksUrl?: string;
  publicKeyPem?: string;
  algorithms?: string[];
}

export type TokenVerifier = (token: string) => Promise<Actor>;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function configFromEnv(env: Record<string, string | undefined>): VerifierConfig {
  return { issuer: env.AUTH_ISSUER, audience: env.AUTH_AUDIENCE, jwksUrl: env.AUTH_JWKS_URL, publicKeyPem: env.AUTH_PUBLIC_KEY };
}

export function createTokenVerifier(config: VerifierConfig): TokenVerifier {
  const algorithms = config.algorithms ?? ["RS256", "ES256", "EdDSA"];
  let key: JWTVerifyGetKey | CryptoKey | KeyObject | undefined;
  if (config.jwksUrl) key = createRemoteJWKSet(new URL(config.jwksUrl));
  const pem = config.publicKeyPem;

  return async (token) => {
    if (!config.issuer || (!config.jwksUrl && !pem)) {
      throw new ServiceUnavailableException("authentication is not configured");
    }
    try {
      const resolved = key ?? (await importSPKI(pem as string, algorithms[0] as string));
      const verified = await jwtVerify(token, resolved as never, { issuer: config.issuer, audience: config.audience, algorithms });
      const subject = verified.payload.sub;
      if (!subject || !UUID.test(subject)) throw new Error("subject is not a uuid");
      return { actorId: subject, role: highestRole(verified.payload.roles ?? verified.payload.role) };
    } catch {
      throw new UnauthorizedException("invalid or expired token");
    }
  };
}
