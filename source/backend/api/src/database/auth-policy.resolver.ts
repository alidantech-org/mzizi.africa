/**
 * Trusted context resolver: extracts principal and policies from request headers and database.
 * Only the application constructs TrustedContext; never bind it from HTTP input directly.
 */
import { Injectable } from "@nestjs/common";
import { PersistencePolicyResolver } from "#/database/persistence/persistence.runtime";
import type { TrustedContext } from "#/database/persistence/persistence.types";

/**
 * Authentication scheme: bearer token (JWT) validated via external service or local key.
 * This resolver must implement your actual auth mechanism (OAuth2, OIDC, custom JWT, etc).
 * For now, it's a placeholder that accepts any bearer token as a user ID.
 *
 * Request headers expected:
 * - Authorization: Bearer {token}
 * - X-Country: {countryCode} (optional, for country scope)
 * - Accept-Language: {language} (optional, for language preference)
 */
@Injectable()
export class AuthPolicyResolver extends PersistencePolicyResolver {
  /**
   * Resolve request metadata into a trusted context for the operation.
   * Extract from: request headers, session store, JWT claims, etc.
   *
   * Example policies that operations can require:
   * - auth.SignedIn: { principal: userId, ...}
   * - auth.PlatformAdmin: { principal: userId, ... }
   * - geography.InCountry: { countryCode: "US", ... }
   */
  async resolve(operation: string): Promise<TrustedContext> {
    // TODO: Implement real auth
    // 1. Extract bearer token from Authorization header
    // 2. Validate token (JWT decode, signature check, expiry)
    // 3. Load user policies from database
    // 4. Resolve country/language from headers or user preferences
    // 5. Return { principal, policies }

    // For now: anonymous (no principal, no policies)
    return {
      principal: null,
      policies: new Map([
        // Public reads can use auth.SignedIn when principal is null
        // This is intentionally permissive for MVP; real auth replaces it
      ]),
    };
  }
}
